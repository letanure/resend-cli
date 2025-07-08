import { Command } from 'commander';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { retrieveBroadcast } from './action.js';
import { fields } from './fields.js';
import { type RetrieveBroadcastData, retrieveBroadcastSchema } from './schema.js';

async function handleRetrieveCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Validate required data
		const data: RetrieveBroadcastData = {
			broadcastId: allOptions.broadcastId as string,
		};

		// Validate the data
		const validationResult = retrieveBroadcastSchema.safeParse(data);
		if (!validationResult.success) {
			displayResults({
				data,
				result: {
					success: false,
					error: `Validation failed: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
				},
				fields,
				outputFormat,
				apiKey,
				isDryRun,
				operation: {
					success: {
						title: 'Broadcast Retrieved',
						message: () => '',
					},
					error: {
						title: 'Validation Error',
						message: 'Invalid input data',
					},
					dryRun: {
						title: 'DRY RUN - Broadcast Retrieve',
						message: 'Validation failed',
					},
				},
			});
			return;
		}

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await retrieveBroadcast(validationResult.data, apiKey);

		// Display results
		displayResults({
			data: validationResult.data,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcast Retrieved',
					message: (data: unknown) => {
						const broadcast = data as { name: string | null; status: string };
						return `Broadcast "${broadcast.name || 'Unnamed'}" retrieved successfully. Status: ${broadcast.status}`;
					},
				},
				error: {
					title: 'Failed to Retrieve Broadcast',
					message: 'Failed to retrieve broadcast from Resend',
				},
				dryRun: {
					title: 'DRY RUN - Broadcast Retrieve',
					message: 'Validation successful! (Broadcast not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		displayResults({
			data: {},
			result: { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
			fields,
			outputFormat,
			apiKey: '',
			isDryRun: false,
			operation: {
				success: {
					title: 'Broadcast Retrieved',
					message: () => '',
				},
				error: {
					title: 'Unexpected Error',
					message: 'An unexpected error occurred',
				},
				dryRun: {
					title: 'DRY RUN - Broadcast Retrieve',
					message: 'Dry run failed',
				},
			},
		});
	}
}

export const broadcastRetrieveCommand = new Command('retrieve')
	.description('Retrieve a broadcast by ID from Resend API')
	.option('--broadcast-id <broadcastId>', 'Broadcast ID')
	.option('--dry-run', 'Validate input without calling API', false)
	.action(handleRetrieveCommand);
