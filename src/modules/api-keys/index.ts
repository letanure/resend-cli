import type { ModuleConfig } from '@/types/index.js';
import { Module } from '@/types/index.js';
import { registerApiKeysCommands } from './cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.apiKeys,
	description: 'Manage API keys',
	registerCommands: registerApiKeysCommands,
};
