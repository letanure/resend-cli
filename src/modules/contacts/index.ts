import type { ModuleConfig } from '@/types/index.js';
import { Module } from '@/types/index.js';
import { registerContactsCommands } from './cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.contacts,
	description: 'Manage contacts in your audiences',
	registerCommands: registerContactsCommands,
};
