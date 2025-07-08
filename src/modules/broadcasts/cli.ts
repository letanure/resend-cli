import type { Command } from 'commander';
import { broadcastCreateCommand } from './create/cli.js';
import { broadcastDeleteCommand } from './delete/cli.js';
import { broadcastListCommand } from './list/cli.js';
import { broadcastRetrieveCommand } from './retrieve/cli.js';
import { broadcastSendCommand } from './send/cli.js';
import { broadcastUpdateCommand } from './update/cli.js';

export function registerBroadcastsCommands(broadcastsCommand: Command): void {
	broadcastsCommand.addCommand(broadcastCreateCommand);
	broadcastsCommand.addCommand(broadcastDeleteCommand);
	broadcastsCommand.addCommand(broadcastListCommand);
	broadcastsCommand.addCommand(broadcastRetrieveCommand);
	broadcastsCommand.addCommand(broadcastSendCommand);
	broadcastsCommand.addCommand(broadcastUpdateCommand);
}
