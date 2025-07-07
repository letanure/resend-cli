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
 * Base field configuration for forms
 */
export interface FormField {
	name: string;
	label: string;
	placeholder?: string;
	helpText?: string;
	type?: 'text' | 'textarea';
	cliFlag?: string; // CLI long flag (--flag)
	cliShortFlag?: string; // CLI short flag (-f)
}

/**
 * Extended field configuration for CLI commands
 * Includes all form properties with required CLI-specific properties
 */
export interface CliField extends FormField {
	placeholder: string; // Required for CLI help
	helpText: string; // Required for CLI help
	cliFlag: string; // CLI long flag (--flag)
	cliShortFlag: string; // CLI short flag (-f)
}
