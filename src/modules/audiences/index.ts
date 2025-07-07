import { Module, type ModuleConfig } from '@/types/index.js';
import { registerAudienceCommands } from './cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.audiences,
	description: 'Audience operations',
	registerCommands: registerAudienceCommands,
};
