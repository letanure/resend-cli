import { Module, type ModuleConfig } from '@/types/index.js';
import { registerEmailCommands } from './cli.js';

export const moduleConfig: ModuleConfig = {
	name: Module.email,
	description: 'Email operations',
	registerCommands: registerEmailCommands,
};
