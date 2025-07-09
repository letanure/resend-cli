import chalk from 'chalk';
import type { Command } from 'commander';
import type { ZodError } from 'zod';
import type { CliField } from '@/types/index.js';

/**
 * Build field-to-flag mapping from provided fields
 */
function buildFieldToFlagMapping(fields: Array<CliField>): Record<string, string> {
	const mapping: Record<string, string> = {};

	for (const field of fields) {
		if (field.name && field.cliFlag) {
			// Map both the field name and snake_case version
			const flagName = `--${field.cliFlag}`;
			mapping[field.name] = flagName;

			// Also map snake_case version of field name
			const snakeCaseName = field.name.replace(/([A-Z])/g, '_$1').toLowerCase();
			if (snakeCaseName !== field.name) {
				mapping[snakeCaseName] = flagName;
			}
		}
	}

	return mapping;
}

/**
 * Standard validation error handler
 * Shows consistent error format across all commands
 */
export function handleValidationError(error: ZodError, command: Command, fields: Array<CliField> = []): never {
	const errorCount = error.issues.length;
	const title = errorCount === 1 ? 'Validation Error' : 'Validation Errors';
	console.error(chalk.red(`✗ ${title}`));

	const fieldMapping = buildFieldToFlagMapping(fields);

	for (const issue of error.issues) {
		const fieldPath = issue.path.join('.');
		const flagName = fieldMapping[fieldPath] || `--${fieldPath}`;
		console.error(chalk.red(`  ${flagName} is required`));
	}

	console.error('');
	command.help();
}

/**
 * Alternative: Show help after validation error
 */
export function handleValidationErrorWithHelp(error: ZodError, command: Command, fields: Array<CliField> = []): never {
	const errorCount = error.issues.length;
	const title = errorCount === 1 ? 'Validation Error' : 'Validation Errors';
	console.error(chalk.red(`✗ ${title}`));

	const fieldMapping = buildFieldToFlagMapping(fields);

	for (const issue of error.issues) {
		const fieldPath = issue.path.join('.');
		const flagName = fieldMapping[fieldPath] || `--${fieldPath}`;
		console.error(chalk.red(`  ${flagName}: ${issue.message}`));
	}

	console.error('');
	command.help();
}
