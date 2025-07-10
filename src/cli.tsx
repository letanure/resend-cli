#!/usr/bin/env node --no-warnings
import { createRequire } from 'node:module';
import chalk from 'chalk';
import { Command } from 'commander';
import { render } from 'ink';
import type { ModuleConfig } from '@/types/index.js';
import { AppMain } from './AppMain.js';
import * as modules from './modules/index.js';

// Configuration
const getVersion = (): string => {
	const require = createRequire(import.meta.url);
	const packageJson = require('../../package.json');
	return packageJson.version;
};

// Setup functions
const createRootCommand = (): Command => {
	const program = new Command();
	program
		.name('resend-cli')
		.description(
			'Resend CLI - Send emails, manage domains, and more\n\nAPI Key: Set RESEND_API_KEY environment variable or use --api-key option',
		)
		.version(getVersion(), '-V, --version', 'output the version number')
		.option('-v', 'output the version number', () => {
			console.log(getVersion());
			process.exit(0);
		});
	
	return program;
};

// Handle unknown command errors consistently
const handleUnknownCommand = (command: Command, unknownCmd: string, context?: string): void => {
	const errorMsg = context
		? chalk.red(`\nError: Unknown ${context} command '${unknownCmd}'\n\n`)
		: chalk.red(`\nError: Unknown command '${unknownCmd}'\n\n`);

	process.stderr.write(errorMsg);
	command.outputHelp();
	process.exit(1);
};

// each module register its own commands
const registerModules = (program: Command, modules: Array<ModuleConfig>): void => {
	for (const module of modules) {
		const moduleCommand = program
			.command(module.name)
			.description(module.description)
			.allowUnknownOption(false)
			.allowExcessArguments(true)
			.action(() => {
				// Check if there are any arguments passed after the module command
				const args = process.argv.slice(3); // Skip 'node', 'script', and module name

				if (args.length > 0 && args[0] && !args[0].startsWith('-')) {
					handleUnknownCommand(moduleCommand, args[0], module.name);
				} else {
					// No arguments, just show help
					moduleCommand.help();
				}
			});

		// Handle unknown subcommands
		moduleCommand.on('command:*', () => {
			handleUnknownCommand(moduleCommand, moduleCommand.args.join(' '), module.name);
		});

		module.registerCommands(moduleCommand);
	}
};

const main = (): void => {
	// Check if only the binary name is provided, OR if --dry-run is the only flag
	const args = process.argv.slice(2);
	const isDryRunOnly = args.length === 1 && args[0] === '--dry-run';

	// Check for API key in args for TUI mode
	const apiKeyIndex = args.findIndex((arg) => arg === '--api-key');
	const apiKey = apiKeyIndex !== -1 && args[apiKeyIndex + 1] ? args[apiKeyIndex + 1] : undefined;

	// Check if we should enter TUI mode (no arguments or just global options)
	const validTuiArgs = ['--dry-run', '--api-key'];
	const shouldEnterTui =
		process.argv.length === 2 ||
		args.every((arg) => validTuiArgs.includes(arg) || (apiKeyIndex !== -1 && arg === args[apiKeyIndex + 1]));

	if (shouldEnterTui) {
		// Pass dry-run flag and API key to TUI
		render(<AppMain isDryRun={isDryRunOnly || args.includes('--dry-run')} apiKey={apiKey} />);
	} else {
		const program = createRootCommand();

		// Add global options to root command
		program.option('--dry-run', 'Enable dry-run mode for all operations', false);
		program.option('--api-key <key>', 'Resend API key (overrides RESEND_API_KEY environment variable)');

		const moduleList = Object.values(modules);

		registerModules(program, moduleList);

		// Handle unknown commands
		program.on('command:*', () => {
			handleUnknownCommand(program, program.args.join(' '));
		});

		program.parse();
	}
};

main();
