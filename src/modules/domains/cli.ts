import type { Command } from 'commander';
import { registerCreateDomainCommand } from './create/cli.js';
import { registerListDomainsCommand } from './list/cli.js';
import { domainRetrieveCommand } from './retrieve/cli.js';
import { domainVerifyCommand } from './verify/cli.js';

export function registerDomainsCommands(domainsCommand: Command): void {
	registerCreateDomainCommand(domainsCommand);
	domainsCommand.addCommand(domainRetrieveCommand);
	domainsCommand.addCommand(domainVerifyCommand);
	registerListDomainsCommand(domainsCommand);
}
