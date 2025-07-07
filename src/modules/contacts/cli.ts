import type { Command } from 'commander';
import { registerCreateContactCommand } from './create/cli.js';
import { registerListContactsCommand } from './list/cli.js';
import { registerRetrieveContactCommand } from './retrieve/cli.js';

export function registerContactsCommands(contactsCommand: Command): void {
	registerCreateContactCommand(contactsCommand);
	registerListContactsCommand(contactsCommand);
	registerRetrieveContactCommand(contactsCommand);
}
