import type { Command } from 'commander';
import { registerRetrieveCommand } from './retrieve/cli.js';
import { registerSendCommand } from './send/cli.js';

export function registerEmailCommands(emailCommand: Command) {
	// Register individual email command modules
	registerSendCommand(emailCommand);
	registerRetrieveCommand(emailCommand);
}
