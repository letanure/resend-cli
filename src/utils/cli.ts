import type { Command } from 'commander';
import type { ZodSchema } from 'zod';
import type { Field } from '@/types/index.js';

// Validate options using a Zod schema
export function validateOptions<T>(options: unknown, schema: ZodSchema<T>): T {
	const validationResult = schema.safeParse(options);

	if (!validationResult.success) {
		const errors = validationResult.error.issues.map((issue) => ({
			path: issue.path[0] || 'unknown',
			message: issue.message,
		}));
		displayValidationErrors(errors);
		process.exit(1);
	}

	return validationResult.data;
}

// Display parsed CLI data using field configuration
export function displayCLIResults(
	data: Record<string, unknown>,
	fields: Array<Field>,
	title: string = 'Parsed data:',
	additionalInfo?: Record<string, string | undefined>,
): void {
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

	console.log('');
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

// Register field options on a command
export function registerFieldOptions(command: Command, fields: Array<Field>): void {
	for (const field of fields) {
		const option = fieldToCommanderOption(field);
		command.option(option.flags, option.description);
	}
}
