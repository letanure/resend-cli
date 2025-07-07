import type { Command } from 'commander';
import type { ZodSchema } from 'zod';
import type { Field } from '@/types/index.js';
import {
	displayInvalidOptionError,
	displayMissingEnvError,
	displayUnknownOptionError,
	displayValidationError,
} from './error-formatting.js';
import { type OutputFormat, outputSuccess, outputValidationErrors } from './output.js';

// Validate options using a Zod schema
export function validateOptions<T>(options: unknown, schema: ZodSchema<T>, format: OutputFormat = 'text'): T {
	const validationResult = schema.safeParse(options);

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

// Display parsed CLI data using field configuration
export function displayCLIResults(
	data: Record<string, unknown>,
	fields: Array<Field>,
	format: OutputFormat = 'text',
	title: string = 'Parsed data:',
	additionalInfo?: Record<string, string | undefined>,
	successMessage?: string,
): void {
	// Prepare result data including additional info
	const resultData = { ...data };
	if (additionalInfo) {
		Object.assign(resultData, additionalInfo);
	}
	if (successMessage) {
		resultData.message = successMessage;
	}

	outputSuccess(resultData, format, () => {
		console.log(title);

		// Loop through fields to display the data
		for (const field of fields) {
			const value = data[field.name];

			if (value !== undefined && value !== null && value !== '') {
				const displayLabel = field.label || field.name;

				// Handle different field types
				let displayValue: string | boolean | number | unknown;
				if (Array.isArray(value)) {
					displayValue = value.join(', ');
				} else if (field.type === 'textarea' && typeof value === 'string' && value.length > 100) {
					displayValue = `${value.substring(0, 100)}...`;
				} else {
					displayValue = value;
				}

				console.log(`${displayLabel}:`, displayValue);
			}
		}

		// Display any additional info (like API key)
		if (additionalInfo) {
			for (const [key, value] of Object.entries(additionalInfo)) {
				if (value) {
					console.log(`${key}:`, value);
				}
			}
		}

		if (successMessage) {
			console.log('');
			console.log(successMessage);
		}

		console.log('');
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
export function fieldToCommanderOption(field: Field): { flags: string; description: string } {
	const flags = `--${field.cliFlag}, -${field.cliShortFlag} <value>`;
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
export function registerFieldOptions(command: Command, fields: Array<Field>): void {
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
					return;
				}
			}
			// Default error output for other Commander.js errors
			process.stderr.write(str);
		},
	});
}
