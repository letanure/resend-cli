import { Module, type ModuleConfig } from '@/types/index.js';

export const moduleConfig: ModuleConfig = {
	name: Module.apiKeys,
	description: 'API key operations',
	registerCommands: (command) => {
		// TODO: Implement API key commands
		command
			.command('list')
			.description('List all API keys')
			.action(() => {
				console.log('API key list command not yet implemented');
			});
	},
};
