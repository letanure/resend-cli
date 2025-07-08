import type { Command } from 'commander';
import { registerCreateDomainCommand } from './create/cli.js';

export function registerDomainsCommands(domainsCommand: Command): void {
	registerCreateDomainCommand(domainsCommand);

	// Add existing list command
	domainsCommand
		.command('list')
		.description('List all domains')
		.action(() => {
			console.log('Domain list command not yet implemented');
		});
}
