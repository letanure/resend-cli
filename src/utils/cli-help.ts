import chalk from 'chalk';
import type { Command } from 'commander';
import type { CliField } from '@/types/index.js';

// Format field option for display with proper alignment
export function formatFieldOption(field: CliField, maxFlagWidth: number): string {
	const flagsText = `--${field.cliFlag}, -${field.cliShortFlag} <value>`;
	const flags = chalk.cyan.bold(flagsText);
	const padding = ' '.repeat(Math.max(0, maxFlagWidth - flagsText.length));
	const description = field.helpText;

	return `  ${flags}${padding}  ${description}`;
}

// Generate custom help text
export function generateCustomHelp(fields: Array<CliField>, examples?: Array<string>, command?: Command): string {
	let helpText = '\n';

	// Get all options from the command (including global ones)
	const allOptions: Array<{ flag: string; description: string }> = [];

	// Add command-specific fields
	for (const field of fields) {
		if (field.cliFlag && field.cliShortFlag) {
			allOptions.push({
				flag: `--${field.cliFlag}, -${field.cliShortFlag} <value>`,
				description: field.helpText,
			});
		}
	}

	// Add global options if command is provided
	if (command) {
		const options = command.options;
		for (const option of options) {
			// Skip if it's already in our fields
			const alreadyAdded = fields.some(
				(field) => option.long === `--${field.cliFlag}` || option.short === `-${field.cliShortFlag}`,
			);
			if (!alreadyAdded) {
				const flagText = option.short ? `${option.long}, ${option.short}` : option.long;
				const flagWithValue = option.required ? `${flagText} <value>` : flagText;
				allOptions.push({
					flag: flagWithValue,
					description: option.description || '',
				} as { flag: string; description: string });
			}
		}
	}

	// Only show OPTIONS section if there are options
	if (allOptions.length > 0) {
		helpText += `${chalk.cyan.bold('OPTIONS:')}\n`;

		// Calculate max width for proper alignment
		const maxFlagWidth = Math.max(...allOptions.map((opt) => opt.flag.length));

		// Add all options with proper alignment
		for (const option of allOptions) {
			const flags = chalk.cyan.bold(option.flag);
			const padding = ' '.repeat(Math.max(0, maxFlagWidth - option.flag.length));
			helpText += `  ${flags}${padding}  ${option.description}\n`;
		}

		helpText += '\n';
	}

	// Add examples if provided
	if (examples && examples.length > 0) {
		helpText += `${chalk.cyan.bold('EXAMPLES:')}\n`;
		for (const example of examples) {
			helpText += `${chalk.gray(`  ${example}`)}\n`;
		}
	}

	return helpText;
}

// Configure command with custom help
export function configureCustomHelp(command: Command, fields: Array<CliField>, examples?: Array<string>): void {
	// Override the help output
	command.configureHelp({
		formatHelp: (cmd, helper) => {
			let output = '';

			// Usage (Docker/Kubernetes style)
			const usage = helper.commandUsage(cmd).replace('[options]', '[OPTIONS]');
			output += `Usage: ${usage.replace(/^[^\s]+\s/, '')}\n\n`;

			// Description
			if (cmd.description()) {
				output += `${helper.commandDescription(cmd)}\n`;
			}

			// Custom formatted options
			output += generateCustomHelp(fields, examples, cmd);

			return output;
		},
	});
}
