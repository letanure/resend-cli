#!/usr/bin/env node

/**
 * Auto-generate documentation from CLI help output
 * This ensures docs stay in sync with actual CLI functionality
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// CLI command to run (relative to project root)
const CLI_COMMAND = 'node dist/src/cli.js';

/**
 * Execute CLI command and capture output
 */
function runCLI(args = '', options = {}) {
	try {
		const result = execSync(`${CLI_COMMAND} ${args}`, {
			cwd: rootDir,
			encoding: 'utf8',
			stderr: 'pipe',
			...options,
		});
		return { stdout: result, stderr: '', success: true };
	} catch (error) {
		return {
			stdout: error.stdout || '',
			stderr: error.stderr || '',
			success: false,
			code: error.status,
		};
	}
}

/**
 * Generate help documentation for a command
 */
function generateHelpDocs(command = '') {
	const helpArgs = command ? `${command} --help` : '--help';
	const result = runCLI(helpArgs);

	if (!result.success) {
		console.warn(`Warning: Could not generate help for "${command}": ${result.stderr}`);
		return `\`\`\`bash\n# Help not available for: ${command}\n\`\`\``;
	}

	return `\`\`\`bash\n$ resend-cli ${helpArgs}\n${result.stdout}\n\`\`\``;
}

/**
 * Generate usage examples
 */
function generateExamples() {
	const examples = [
		{
			title: 'Send a simple email',
			command:
				'email send --from="Acme <onboarding@resend.dev>" --to="delivered@resend.dev" --subject="Hello" --text="Hello World"',
			description: 'Send a basic text email',
		},
		{
			title: 'Send HTML email',
			command:
				'email send --from="Acme <onboarding@resend.dev>" --to="delivered@resend.dev" --subject="Welcome" --html="<h1>Welcome!</h1>"',
			description: 'Send an HTML email with formatted sender',
		},
		{
			title: 'Get JSON output',
			command:
				'email send --output json --from="Acme <onboarding@resend.dev>" --to="delivered@resend.dev" --subject="Test" --text="Hello" | jq ".data.id"',
			description: 'Send email and extract ID using jq for automation',
		},
	];

	let output = '';
	for (const example of examples) {
		output += `### ${example.title}\n\n`;
		output += `${example.description}\n\n`;
		output += `\`\`\`bash\n$ resend-cli ${example.command}\n\`\`\`\n\n`;
	}

	return output;
}

/**
 * Generate complete CLI reference with all arguments
 */
function generateCLIReference() {
	let output = '';

	// Global options
	output += '## Global Options\n\n';
	output += 'Available for all commands:\n\n';
	output += '- `--output <format>` - Output format (text, json)\n';
	output += '- `--help, -h` - Display help for command\n';
	output += '- `--version, -V` - Output the version number\n\n';

	// Get main help to see all modules
	const mainHelp = runCLI('--help');
	if (mainHelp.success) {
		// Parse modules from main help
		const lines = mainHelp.stdout.split('\n');
		let inCommands = false;
		const modules = [];

		for (const line of lines) {
			if (line.includes('Commands:')) {
				inCommands = true;
				continue;
			}
			if (inCommands && line.trim() && !line.includes('help [command]')) {
				const match = line.match(/^\s*(\w+)\s+(.+)$/);
				if (match) {
					modules.push({
						name: match[1],
						description: match[2],
					});
				}
			}
		}

		// Generate reference for each module
		for (const module of modules) {
			output += `## ${module.name}\n\n`;
			output += `${module.description}\n\n`;

			// Get module help
			const moduleHelp = runCLI(`${module.name} --help`);
			if (moduleHelp.success) {
				const moduleLines = moduleHelp.stdout.split('\n');
				let inModuleCommands = false;
				const commands = [];

				for (const line of moduleLines) {
					if (line.includes('Commands:')) {
						inModuleCommands = true;
						continue;
					}
					if (inModuleCommands && line.trim() && !line.includes('help [command]')) {
						const match = line.match(/^\s*(\w+)\s+(.+)$/);
						if (match) {
							commands.push({
								name: match[1],
								description: match[2],
							});
						}
					}
				}

				// Generate reference for each command
				for (const command of commands) {
					output += `### ${module.name} ${command.name}\n\n`;
					output += `${command.description}\n\n`;

					// Get command help and extract options
					const commandHelp = runCLI(`${module.name} ${command.name} --help`);
					if (commandHelp.success) {
						const commandLines = commandHelp.stdout.split('\n');
						let inOptions = false;
						const options = [];

						for (const line of commandLines) {
							if (line.includes('Options:')) {
								inOptions = true;
								continue;
							}
							if (inOptions && line.trim()) {
								// Parse option line: "  --from, -f <value>     Sender email address"
								const optionMatch = line.match(/^\s*(--[\w-]+(?:,\s*-\w)?)\s*(?:<[^>]+>)?\s+(.+)$/);
								if (optionMatch) {
									options.push({
										flag: optionMatch[1],
										description: optionMatch[2],
									});
								}
							}
						}

						if (options.length > 0) {
							output += '**Arguments:**\n\n';
							for (const option of options) {
								output += `- \`${option.flag}\` - ${option.description}\n`;
							}
							output += '\n';
						}
					}
				}
			}

			output += '\n';
		}
	}

	return output;
}

/**
 * Generate README.md from template
 */
function generateReadme() {
	const templatePath = join(rootDir, 'templates', 'README.template.md');
	const readmePath = join(rootDir, 'README.md');

	try {
		const template = readFileSync(templatePath, 'utf8');
		const generatedContent = generateFromTemplate(template);
		writeFileSync(readmePath, generatedContent);
		console.log('✅ README.md generated from template with latest CLI help output');
	} catch (error) {
		console.error('❌ Error generating README.md:', error.message);
		process.exit(1);
	}
}

/**
 * Generate content from template with replacements
 */
function generateFromTemplate(template) {
	const replacements = {
		'{{CLI_HELP_MAIN}}': generateHelpDocs(),
		'{{CLI_HELP_EMAIL}}': generateHelpDocs('email'),
		'{{CLI_HELP_EMAIL_SEND}}': generateHelpDocs('email send'),
		'{{CLI_EXAMPLES}}': generateExamples(),
		'{{CLI_REFERENCE}}': generateCLIReference(),
		'{{GENERATED_DATE}}': new Date().toISOString().split('T')[0],
	};

	let content = template;
	for (const [placeholder, replacement] of Object.entries(replacements)) {
		content = content.replace(new RegExp(placeholder, 'g'), replacement);
	}

	return content;
}

/**
 * Main execution
 */
function main() {
	console.log('🔄 Generating documentation from CLI help output...');

	// Ensure dist exists
	try {
		execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
	} catch {
		console.error('❌ Failed to build CLI before generating docs');
		process.exit(1);
	}

	generateReadme();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { generateHelpDocs, generateExamples, generateCLIReference, generateFromTemplate };
