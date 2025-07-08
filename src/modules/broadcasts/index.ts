import { Module, type ModuleConfig } from '@/types/index.js';
import { broadcastCreateCommand } from './create/cli.js';
import { broadcastRetrieveCommand } from './retrieve/cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.broadcasts,
	description: 'Broadcast operations',
	registerCommands: (command) => {
		command.addCommand(broadcastCreateCommand);
		command.addCommand(broadcastRetrieveCommand);

		// TODO: Implement other broadcast commands
		command
			.command('list')
			.description('List all broadcasts')
			.action(() => {
				console.log('Broadcast list command not yet implemented');
			});
	},
};
