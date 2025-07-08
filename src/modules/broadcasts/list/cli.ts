import { Command } from 'commander';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { listBroadcasts } from './action.js';
import { fields } from './fields.js';
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
			data: validationResult.data,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcasts Retrieved Successfully',
					message: (data: unknown) => {
						const broadcasts = data as { object: string; data: Array<unknown> };
						const count = broadcasts.data.length;
						return `Retrieved ${count} broadcast${count === 1 ? '' : 's'} successfully.`;
					},
				},
				error: {
					title: 'Failed to List Broadcasts',
					message: 'There was an error retrieving the broadcasts. Please check your API key and try again.',
				},
				dryRun: {
					title: 'Dry Run: List Broadcasts',
					message: 'This would retrieve all broadcasts from your account.',
				},
			},
		});
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

export const broadcastListCommand = new Command('list')
	.alias('l')
	.description('List all broadcasts')
	.action(handleListCommand);

// No CLI options needed for listing - it just lists all broadcasts
