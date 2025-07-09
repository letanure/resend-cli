import type { Command } from 'commander';
import { emailCancelCommand } from './cancel/cli.js';
import { emailRetrieveCommand } from './retrieve/cli.js';
import { emailSendCommand } from './send/cli.js';
import { emailUpdateCommand } from './update/cli.js';

export function registerEmailCommands(emailCommand: Command): void {
	emailCommand.addCommand(emailSendCommand);
	emailCommand.addCommand(emailRetrieveCommand);
	emailCommand.addCommand(emailUpdateCommand);
	emailCommand.addCommand(emailCancelCommand);
}
