import { Module, type ModuleConfig } from '@/types/index.js';
import { broadcastCreateCommand } from './create/cli.js';
import { broadcastDeleteCommand } from './delete/cli.js';
import { broadcastListCommand } from './list/cli.js';
import { broadcastRetrieveCommand } from './retrieve/cli.js';
import { broadcastSendCommand } from './send/cli.js';
import { broadcastUpdateCommand } from './update/cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.broadcasts,
	description: 'Broadcast operations',
	registerCommands: (command) => {
		command.addCommand(broadcastCreateCommand);
		command.addCommand(broadcastDeleteCommand);
		command.addCommand(broadcastListCommand);
		command.addCommand(broadcastRetrieveCommand);
		command.addCommand(broadcastSendCommand);
		command.addCommand(broadcastUpdateCommand);
	},
};
