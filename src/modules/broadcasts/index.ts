import { Module, type ModuleConfig } from '@/types/index.js';

export const moduleConfig: ModuleConfig = {
	name: Module.broadcasts,
	description: 'Broadcast operations',
	registerCommands: (command) => {
		// TODO: Implement broadcast commands
		command
			.command('list')
			.description('List all broadcasts')
			.action(() => {
				console.log('Broadcast list command not yet implemented');
			});
	},
};
