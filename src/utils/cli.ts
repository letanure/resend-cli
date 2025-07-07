import type { Command } from 'commander';
import type { ZodSchema } from 'zod';
import type { CliField } from '@/types/index.js';
import { formatDataWithFields, formatForCLI } from '@/utils/display-formatter.js';
import {
	displayInvalidOptionError,
	displayMissingEnvError,
	displayUnknownOptionError,
	displayValidationError,
} from './error-formatting.js';
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
export function validateOptions<T>(options: unknown, schema: ZodSchema<T>, format: OutputFormat = 'text'): T {
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
			displayValidationErrors(errors);
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
	_successMessage?: string,
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

	// Output using shared formatter
	const output = formatForCLI(formattedFields, title);
	console.log(output);
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

// Display validation errors
export function displayValidationErrors(errors: Array<{ path: string | number; message: string }>): void {
	displayValidationError(
		errors.map((err) => ({
			field: String(err.path) || 'unknown',
			message: err.message,
		})),
	);
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
