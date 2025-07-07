import chalk from 'chalk';

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
 * Display validation errors and exit
 */
export function displayValidationError(
	errors: Array<{ field: string; message: string }>,
	options: ErrorFormatOptions = {},
): never {
	const { title = 'Validation Error', suggestion = 'Use --help for usage information' } = options;

	console.error(chalk.red(`✗ ${title}`));
	console.error('');

	for (const error of errors) {
		console.error(chalk.red(`  • ${chalk.bold(error.field)}: ${error.message}`));
	}

	console.error('');
	console.error(chalk.cyan(`  ${suggestion}`));

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
