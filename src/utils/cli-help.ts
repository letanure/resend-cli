import chalk from 'chalk';
import type { Command } from 'commander';
import type { Field } from '@/types/index.js';

// Format field option for display with proper alignment
export function formatFieldOption(field: Field, maxFlagWidth: number): string {
	const flagsText = `--${field.cliFlag}, -${field.cliShortFlag} <value>`;
	const flags = chalk.cyan.bold(flagsText);
	const padding = ' '.repeat(Math.max(0, maxFlagWidth - flagsText.length));
	const description = field.helpText;

	return `  ${flags}${padding}  ${description}`;
}

// Calculate the maximum width needed for flags
function getMaxFlagWidth(fields: Array<Field>): number {
	return Math.max(...fields.map((field) => `--${field.cliFlag}, -${field.cliShortFlag} <value>`.length));
}

// Generate custom help text
export function generateCustomHelp(fields: Array<Field>, examples?: Array<string>): string {
	let helpText = '\n';

	// Add options header
	helpText += `${chalk.cyan.bold('OPTIONS:')}\n`;

	// Calculate max width for proper alignment
	const maxFlagWidth = getMaxFlagWidth(fields);

	// Add all fields with proper alignment
	for (const field of fields) {
		helpText += `${formatFieldOption(field, maxFlagWidth)}\n`;
	}

	helpText += '\n';

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
export function configureCustomHelp(command: Command, fields: Array<Field>, examples?: Array<string>): void {
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
			output += generateCustomHelp(fields, examples);

			return output;
		},
	});
}
