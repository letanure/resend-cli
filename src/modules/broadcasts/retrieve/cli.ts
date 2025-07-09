import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
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

		// Validate the data using unified validation
		const validatedData = validateOptions<RetrieveBroadcastData>(
			allOptions,
			retrieveBroadcastSchema,
			outputFormat,
			fields,
			command,
		);

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await retrieveBroadcast(validatedData, apiKey);

		// Display results
		displayResults({
			data: validatedData,
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

export function registerRetrieveBroadcastCommand(broadcastsCommand: Command): void {
	const retrieveCommand = createRetrieveBroadcastCommand();
	broadcastsCommand.addCommand(retrieveCommand);
}

function createRetrieveBroadcastCommand(): Command {
	const retrieveCommand = new Command('retrieve')
		.description('Retrieve a broadcast by ID from Resend API')
		.action(handleRetrieveCommand);

	registerFieldOptions(retrieveCommand, fields);

	const retrieveExamples = [
		'$ resend-cli broadcast retrieve --broadcast-id="559ac32e-9ef5-46fb-82a1-b76b840c0f7b"',
		'$ resend-cli broadcast retrieve -b 559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		'$ resend-cli broadcast retrieve --broadcast-id="..." --dry-run',
		'$ resend-cli broadcast retrieve --output json --broadcast-id="..." | jq \'.\'',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli broadcast retrieve --broadcast-id="..."',
	];

	configureCustomHelp(retrieveCommand, fields, retrieveExamples);

	return retrieveCommand;
}

export const broadcastRetrieveCommand = new Command('retrieve')
	.description('Retrieve a broadcast by ID from Resend API')
	.action(handleRetrieveCommand);
