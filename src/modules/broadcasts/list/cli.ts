import { Command } from 'commander';
import { registerFieldOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { listBroadcasts } from './action.js';
import { displayFields, fields } from './fields.js';
import { type ListBroadcastsData, listBroadcastsSchema } from './schema.js';

async function handleListCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// List has no input parameters
		const data: ListBroadcastsData = {};

		// Validate the data (empty object)
		const validationResult = listBroadcastsSchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await listBroadcasts(validationResult.data, apiKey);

		displayResults({
			data: {},
			result,
			fields: displayFields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcasts Retrieved Successfully',
					message: (data: unknown) => {
						// Handle the API response structure - data should have a 'data' property with the array
						const responseData = data as { data?: Array<unknown> };
						const broadcasts = responseData.data || [];

						if (Array.isArray(broadcasts) && broadcasts.length === 0) {
							return 'No broadcasts found (0 results). Create your first broadcast to get started.';
						}
						const count = Array.isArray(broadcasts) ? broadcasts.length : 0;
						return `Found ${count} broadcast${count === 1 ? '' : 's'}`;
					},
				},
				error: {
					title: 'Failed to Retrieve Broadcasts',
					message: 'Broadcasts retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - Broadcasts List (validation only)',
					message: 'Validation successful! (Broadcasts not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerListBroadcastsCommand(broadcastsCommand: Command): void {
	const listCommand = createListBroadcastsCommand();
	broadcastsCommand.addCommand(listCommand);
}

function createListBroadcastsCommand(): Command {
	const listCommand = new Command('list').description('List all broadcasts in Resend').action(handleListCommand);

	registerFieldOptions(listCommand, fields);

	const listExamples = [
		'$ resend-cli broadcasts list',
		"$ resend-cli broadcasts list --output json | jq '.'",
		'$ resend-cli broadcasts list --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli broadcasts list',
	];

	configureCustomHelp(listCommand, fields, listExamples);

	return listCommand;
}

export const broadcastListCommand = new Command('list')
	.alias('l')
	.description('List all broadcasts')
	.action(handleListCommand);
