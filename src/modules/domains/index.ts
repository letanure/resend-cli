import { Module, type ModuleConfig } from '@/types/index.js';
import { registerDomainsCommands } from './cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.domains,
	description: 'Domain operations',
	registerCommands: registerDomainsCommands,
};
