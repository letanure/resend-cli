import type { Command } from 'commander';
import type { ZodSchema } from 'zod';
import type { Field } from '@/types/index.js';
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

				// Handle array values
				const displayValue = Array.isArray(value)
					? value.join(', ')
					: field.type === 'textarea' && typeof value === 'string' && value.length > 100
						? `${value.substring(0, 100)}...`
						: value;

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
	console.error('Validation errors:');
	for (const error of errors) {
		const field = error.path || 'unknown';
		console.error(`  - ${field}: ${error.message}`);
	}
	console.error('\nUse --help for usage information');
}

// Validate required environment variable
export function validateEnvironmentVariable(varName: string, helpUrl?: string): string {
	const value = process.env[varName];
	if (!value) {
		console.error(`Missing ${varName} environment variable.`);
		if (helpUrl) {
			console.error(`Get your API key at ${helpUrl}`);
		}
		process.exit(1);
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
		console.error(`Invalid output format: '${value}'`);
		console.error(`Valid options are: ${validFormats.join(', ')}`);
		process.exit(1);
	}
	return value as OutputFormat;
}

// Register field options on a command
export function registerFieldOptions(command: Command, fields: Array<Field>): void {
	// Add output format option first with validation
	command.option('--output <format>', 'Output format (text, json)', validateOutputFormat, 'text');

	// Add field-specific options
	for (const field of fields) {
		const option = fieldToCommanderOption(field);
		command.option(option.flags, option.description);
	}
}
