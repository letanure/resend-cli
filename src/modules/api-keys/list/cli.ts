import { Command } from 'commander';
import { registerFieldOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { listApiKeys } from './action.js';
import { displayFields, fields } from './fields.js';

async function handleListCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	// Get global options from the root program (need to go up two levels)
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	// Merge local and global options
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		const result = isDryRun ? undefined : await listApiKeys(apiKey);

		displayResults({
			data: {},
			result,
			fields: displayFields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'API Key Search Completed',
					message: (data: unknown) => {
						// Handle the API response structure - data should have a 'data' property with the array
						const responseData = data as { data?: Array<unknown> };
						const apiKeys = responseData.data || [];

						if (Array.isArray(apiKeys) && apiKeys.length === 0) {
							return 'No API keys found (0 results). Create your first API key to get started.';
						}
						const count = Array.isArray(apiKeys) ? apiKeys.length : 0;
						return `Found ${count} API key${count === 1 ? '' : 's'}`;
					},
				},
				error: {
					title: 'Failed to Retrieve API Keys',
					message: 'API keys retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - API Keys List (validation only)',
					message: 'Validation successful! (API keys not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerListApiKeysCommand(apiKeysCommand: Command): void {
	const listCommand = createListApiKeysCommand();
	apiKeysCommand.addCommand(listCommand);
}

function createListApiKeysCommand(): Command {
	const listCommand = new Command('list').description('List all API keys in Resend').action(handleListCommand);

	registerFieldOptions(listCommand, fields);

	const listExamples = [
		'$ resend-cli api-keys list',
		"$ resend-cli api-keys list --output json | jq '.'",
		'$ resend-cli api-keys list --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli api-keys list',
	];

	configureCustomHelp(listCommand, fields, listExamples);

	return listCommand;
}
