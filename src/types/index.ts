import type { Command } from 'commander';

export enum Module {
	main = 'main',
	email = 'email',
	domains = 'domains',
	apiKeys = 'apiKeys',
	broadcasts = 'broadcasts',
	audiences = 'audiences',
	contacts = 'contacts',
}

/**
 * Module configuration that enforces AppState values for names
 */
export interface ModuleConfig {
	name: Exclude<Module, Module.main>;
	description: string;
	registerCommands: (command: Command) => void;
}

/**
 * Standard API result format used across all endpoints
 */
export interface ApiResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	debug?: {
		request?: unknown;
		response?: unknown;
	};
}

/**
 * Standard field configuration for forms and CLI arguments
 */
export interface Field {
	name: string;
	label: string;
	placeholder: string;
	helpText: string;
	type?: 'text' | 'textarea';
	cliFlag: string;
	cliShortFlag: string;
}
