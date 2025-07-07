import { Module, type ModuleConfig } from '@/types/index.js';

export const moduleConfig: ModuleConfig = {
	name: Module.contacts,
	description: 'Contact operations',
	registerCommands: (command) => {
		// TODO: Implement contact commands
		command
			.command('list')
			.description('List all contacts')
			.action(() => {
				console.log('Contact list command not yet implemented');
			});
	},
};
