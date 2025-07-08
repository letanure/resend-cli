import type { Command } from 'commander';
import { registerCreateDomainCommand } from './create/cli.js';
import { domainRetrieveCommand } from './retrieve/cli.js';

export function registerDomainsCommands(domainsCommand: Command): void {
	registerCreateDomainCommand(domainsCommand);
	domainsCommand.addCommand(domainRetrieveCommand);

	// Add existing list command
	domainsCommand
		.command('list')
		.description('List all domains')
		.action(() => {
			console.log('Domain list command not yet implemented');
		});
}
