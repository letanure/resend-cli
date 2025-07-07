import { Module, type ModuleConfig } from '@/types/index.js';

export const moduleConfig: ModuleConfig = {
	name: Module.audiences,
	description: 'Audience operations',
	registerCommands: (command) => {
		// TODO: Implement audience commands
		command
			.command('list')
			.description('List all audiences')
			.action(() => {
				console.log('Audience list command not yet implemented');
			});
	},
};
