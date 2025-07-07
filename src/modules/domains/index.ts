import { Module, type ModuleConfig } from '@/types/index.js';

export const moduleConfig: ModuleConfig = {
	name: Module.domains,
	description: 'Domain operations',
	registerCommands: (command) => {
		// TODO: Implement domain commands
		command
			.command('list')
			.description('List all domains')
			.action(() => {
				console.log('Domain list command not yet implemented');
			});
	},
};
