#!/usr/bin/env node --no-warnings
import { createRequire } from 'node:module';
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
	return program
		.name('resend-cli')
		.description('Resend CLI - Send emails, manage domains, and more')
		.version(getVersion());
};

// each module register its own commands
const registerModules = (program: Command, modules: Array<ModuleConfig>): void => {
	for (const module of modules) {
		const moduleCommand = program
			.command(module.name)
			.description(module.description)
			.action(() => {
				moduleCommand.help();
			});

		module.registerCommands(moduleCommand);
	}
};

// Entry point
const main = (): void => {
	if (process.argv.length === 2) {
		render(<AppMain />);
	} else {
		const program = createRootCommand();
		const moduleList = Object.values(modules);

		registerModules(program, moduleList);

		program.parse();
	}
};

main();
