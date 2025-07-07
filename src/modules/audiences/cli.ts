import type { Command } from 'commander';
import { registerCreateAudienceCommand } from './create/cli.js';

export function registerAudienceCommands(audienceCommand: Command) {
	// Register individual audience command modules
	registerCreateAudienceCommand(audienceCommand);
}
