import type { Command } from 'commander';
import { registerCreateApiKeyCommand } from './create/cli.js';
import { registerDeleteApiKeyCommand } from './delete/cli.js';
import { registerListApiKeysCommand } from './list/cli.js';

export function registerApiKeysCommands(apiKeysCommand: Command): void {
	registerCreateApiKeyCommand(apiKeysCommand);
	registerDeleteApiKeyCommand(apiKeysCommand);
	registerListApiKeysCommand(apiKeysCommand);
}
