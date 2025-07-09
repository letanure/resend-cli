import chalk from 'chalk';
import type { Command } from 'commander';
import type { ZodSchema } from 'zod';
import type { CliField } from '@/types/index.js';
import { formatDataWithFields, formatForCLI } from '@/utils/display-formatter.js';
import { displayInvalidOptionError, displayMissingEnvError, displayUnknownOptionError } from './error-formatting.js';
import { type OutputFormat, outputSuccess, outputValidationErrors } from './output.js';

// Convert camelCase keys to snake_case for CLI compatibility
function transformCliOptions(options: Record<string, unknown>): Record<string, unknown> {
	const transformed: Record<string, unknown> = {};
	// System flags that should not be converted
	const systemFlags = ['dryRun', 'output'];

	for (const [key, value] of Object.entries(options)) {
		if (systemFlags.includes(key)) {
			// Keep system flags as-is
			transformed[key] = value;
		} else {
			// Convert camelCase to snake_case for field names
			const snakeKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
			transformed[snakeKey] = value;
		}
	}
	return transformed;
}

// Validate options using a Zod schema
export function validateOptions<T>(
	options: unknown,
	schema: ZodSchema<T>,
	format: OutputFormat = 'text',
	fields: Array<CliField> = [],
	command?: Command,
): T {
	// Transform camelCase keys to snake_case if options is an object
	const transformedOptions =
		options && typeof options === 'object' ? transformCliOptions(options as Record<string, unknown>) : options;

	const validationResult = schema.safeParse(transformedOptions);

	if (!validationResult.success) {
		const errors = validationResult.error.issues.map((issue) => ({
			path: issue.path[0] || 'unknown',
			message: issue.message,
		}));

		outputValidationErrors(errors, format, () => {
			displayValidationErrors(errors, fields, command);
		});

		process.exit(1);
	}

	return validationResult.data;
}

/**
 * Console output utilities for CLI results
 */
function logCliResults(
	data: Record<string, unknown>,
	fields: Array<CliField>,
	title: string,
	additionalInfo?: Record<string, string | undefined>,
	successMessage?: string,
): void {
	// Format the main data using the shared formatter
	const formattedFields = formatDataWithFields(data, fields);

	// Add additional info that's not already shown
	if (additionalInfo) {
		for (const [key, value] of Object.entries(additionalInfo)) {
			if (value && key !== 'ID') {
				// Skip ID since it's already shown as Email ID
				formattedFields.push({ label: key, value });
			}
		}
	}

	// Show title with colors
	console.log(chalk.green(`✓ ${title}`));

	// If we have data to show, format and display it
	if (formattedFields.length > 0) {
		const output = formatForCLI(formattedFields, '');
		console.log(output);
	}

	// Always show success message if provided
	if (successMessage) {
		console.log(chalk.yellow(`${successMessage}`));
	}
}

// Display parsed CLI data using field configuration
export function displayCLIResults(
	data: Record<string, unknown>,
	fields: Array<CliField>,
	format: OutputFormat = 'text',
	title: string = 'Parsed data:',
	additionalInfo?: Record<string, string | undefined>,
	successMessage?: string,
): void {
	// For JSON output, show raw data without modifications
	if (format === 'json') {
		outputSuccess(data, format, () => {
			// No text callback needed for JSON output
		});
		return;
	}

	// For text output, use formatted display
	outputSuccess(data, format, () => {
		logCliResults(data, fields, title, additionalInfo, successMessage);
	});
}

// Display CLI errors with colors
export function displayCLIError(
	_data: Record<string, unknown>,
	_fields: Array<CliField>,
	format: OutputFormat = 'text',
	title: string = 'Error:',
	additionalInfo?: Record<string, string | undefined>,
	errorMessage?: string,
): void {
	// For JSON output, use the standard error output
	if (format === 'json') {
		const errorData = {
			success: false,
			error: errorMessage || title,
			...additionalInfo,
		};
		console.log(JSON.stringify(errorData, null, 2));
		return;
	}

	// For text output, use colors

	// Show error title with colors
	console.error(chalk.red(`✗ ${title}`));

	// Show error message if provided
	if (errorMessage) {
		console.error(chalk.red(errorMessage));
	}

	// Show additional error info
	if (additionalInfo) {
		for (const [key, value] of Object.entries(additionalInfo)) {
			if (value) {
				console.error(chalk.red(`${key}: ${value}`));
			}
		}
	}
}

// Display validation errors
export function displayValidationErrors(
	errors: Array<{ path: string | number; message: string }>,
	fields: Array<CliField> = [],
	command?: Command,
): void {
	const errorCount = errors.length;
	const title = errorCount === 1 ? 'Validation Error' : 'Validation Errors';

	console.error(chalk.red(`✗ ${title}`));

	const fieldMapping = buildFieldToFlagMapping(fields);

	for (const error of errors) {
		const flagName = fieldMapping[String(error.path)] || `--${String(error.path)}`;
		console.error(chalk.red(`  ${flagName} is required`));
	}

	console.error('');

	if (command) {
		command.help();
	} else {
		console.error(chalk.cyan('Use --help for usage information'));
	}
}

// Build field-to-flag mapping from provided fields
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

// Validate required environment variable
export function validateEnvironmentVariable(varName: string, helpUrl?: string): string {
	const value = process.env[varName];
	if (!value) {
		displayMissingEnvError(varName, helpUrl, { exitCode: 1 });
	}
	return value;
}

// Convert field configuration to Commander.js options
export function fieldToCommanderOption(field: CliField): { flags: string; description: string } {
	// Ensure we don't double up on dashes
	const cliFlag = field.cliFlag.startsWith('--') ? field.cliFlag : `--${field.cliFlag}`;
	const shortFlag = field.cliShortFlag.startsWith('-') ? field.cliShortFlag : `-${field.cliShortFlag}`;
	const flags = `${cliFlag}, ${shortFlag} <value>`;
	return {
		flags,
		description: field.helpText,
	};
}

// Validate output format
function validateOutputFormat(value: string): OutputFormat {
	const validFormats: Array<OutputFormat> = ['text', 'json'];
	if (!validFormats.includes(value as OutputFormat)) {
		displayInvalidOptionError(`--output ${value}`, validFormats, {
			title: 'Invalid Output Format',
			exitCode: 1,
		});
	}
	return value as OutputFormat;
}

// Register field options on a command
export function registerFieldOptions(command: Command, fields: Array<CliField>): void {
	// Add global options first
	command.option('--output <format>', 'Output format (text, json)', validateOutputFormat, 'text');
	command.option('--dry-run', 'Validate and preview without sending');

	// Add field-specific options
	for (const field of fields) {
		const option = fieldToCommanderOption(field);
		command.option(option.flags, option.description);
	}

	// Configure consistent error output for all commands
	command.configureOutput({
		writeErr: (str) => {
			// Custom error formatting for unknown options
			if (str.includes('unknown option')) {
				const match = str.match(/unknown option '([^']+)'/);
				if (match?.[1]) {
					const invalidOption = match[1];
					displayUnknownOptionError(invalidOption);
					// Function never returns, so this return is unreachable but kept for clarity
				}
			}
			// Default error output for other Commander.js errors
			process.stderr.write(str);
		},
	});
}
