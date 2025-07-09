import chalk from 'chalk';
import type { CliField } from '@/types/index.js';

/**
 * Consistent error formatting for CLI
 * Following community standards like Docker, Git, npm
 */

export interface ErrorFormatOptions {
	title?: string;
	suggestion?: string;
	example?: string;
	exitCode?: number;
}

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
 * Display validation errors and exit
 */
export function displayValidationError(
	errors: Array<{ field: string; message: string }>,
	options: ErrorFormatOptions = {},
	fields: Array<CliField> = [],
): never {
	const errorCount = errors.length;
	const defaultTitle = errorCount === 1 ? 'Validation Error' : 'Validation Errors';
	const { title = defaultTitle, suggestion = 'Use --help for usage information' } = options;

	console.error(chalk.red(`✗ ${title}`));

	const fieldMapping = buildFieldToFlagMapping(fields);

	for (const error of errors) {
		const flagName = fieldMapping[error.field] || `--${error.field}`;
		console.error(chalk.red(`  ${flagName} is required`));
	}

	console.error('');
	console.error(chalk.cyan(`${suggestion}`));

	process.exit(options.exitCode ?? 1);
}

/**
 * Display invalid option errors and exit
 */
export function displayInvalidOptionError(
	option: string,
	validOptions?: Array<string>,
	options: ErrorFormatOptions = {},
): never {
	const { suggestion = 'Run --help to see available options' } = options;

	console.error(chalk.red(`✗ Invalid option: ${chalk.bold(option)}`));

	if (validOptions && validOptions.length > 0) {
		console.error('');
		console.error(chalk.yellow('  Valid options:'));
		for (const validOption of validOptions) {
			console.error(chalk.cyan(`    ${validOption}`));
		}
	}

	console.error('');
	console.error(chalk.cyan(`  ${suggestion}`));

	process.exit(options.exitCode ?? 1);
}

/**
 * Display unknown option errors and exit
 */
export function displayUnknownOptionError(option: string, options: ErrorFormatOptions = {}): never {
	const { suggestion = 'Run --help to see available options' } = options;

	console.error(chalk.red(`✗ Unknown option: ${chalk.bold(option)}`));
	console.error('');
	console.error(chalk.cyan(`  ${suggestion}`));

	process.exit(options.exitCode ?? 1);
}

/**
 * Display missing environment variable errors and exit
 */
export function displayMissingEnvError(varName: string, helpUrl?: string, options: ErrorFormatOptions = {}): never {
	const { title = 'Configuration Error' } = options;

	console.error(chalk.red(`✗ ${title}`));
	console.error('');
	console.error(chalk.red(`  Missing required environment variable: ${chalk.bold(varName)}`));

	if (helpUrl) {
		console.error('');
		console.error(chalk.cyan('  How to fix:'));
		console.error(chalk.cyan(`    Get your API key at ${helpUrl}`));
		console.error(chalk.cyan(`    Set it as: export ${varName}="your_key_here"`));
	}

	process.exit(options.exitCode ?? 1);
}

/**
 * Display general errors and exit
 */
export function displayGeneralError(message: string, options: ErrorFormatOptions = {}): never {
	const { title = 'Error', suggestion } = options;

	console.error(chalk.red(`✗ ${title}`));
	console.error('');
	console.error(chalk.red(`  ${message}`));

	if (suggestion) {
		console.error('');
		console.error(chalk.cyan(`  ${suggestion}`));
	}

	if (options.example) {
		console.error('');
		console.error(chalk.yellow('  Example:'));
		console.error(chalk.gray(`    ${options.example}`));
	}

	process.exit(options.exitCode ?? 1);
}
