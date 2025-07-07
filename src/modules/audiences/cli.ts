import type { Command } from 'commander';
import { registerCreateAudienceCommand } from './create/cli.js';
import { createDeleteAudienceCommand } from './delete/cli.js';
import { createListAudienceCommand } from './list/cli.js';
import { createRetrieveAudienceCommand } from './retrieve/cli.js';

export function registerAudienceCommands(audienceCommand: Command) {
	// Register individual audience command modules
	registerCreateAudienceCommand(audienceCommand);
	audienceCommand.addCommand(createRetrieveAudienceCommand());
	audienceCommand.addCommand(createDeleteAudienceCommand());
	audienceCommand.addCommand(createListAudienceCommand());
}
