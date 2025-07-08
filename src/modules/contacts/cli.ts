import type { Command } from 'commander';
import { registerCreateContactCommand } from './create/cli.js';
import { registerDeleteContactCommand } from './delete/cli.js';
import { registerListContactsCommand } from './list/cli.js';
import { registerRetrieveContactCommand } from './retrieve/cli.js';
import { registerUpdateContactCommand } from './update/cli.js';

export function registerContactsCommands(contactsCommand: Command): void {
	registerCreateContactCommand(contactsCommand);
	registerDeleteContactCommand(contactsCommand);
	registerListContactsCommand(contactsCommand);
	registerRetrieveContactCommand(contactsCommand);
	registerUpdateContactCommand(contactsCommand);
}
