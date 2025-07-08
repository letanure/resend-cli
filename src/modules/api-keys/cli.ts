import type { Command } from 'commander';
import { registerCreateApiKeyCommand } from './create/cli.js';

export function registerApiKeysCommands(apiKeysCommand: Command): void {
	registerCreateApiKeyCommand(apiKeysCommand);
}
