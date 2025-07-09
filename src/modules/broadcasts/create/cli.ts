import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { createBroadcast } from './action.js';
import { fields } from './fields.js';
import { type CreateBroadcastData, createBroadcastSchema } from './schema.js';

async function handleCreateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Validate the data using unified validation
		const validatedData = validateOptions<CreateBroadcastData>(
			allOptions,
			createBroadcastSchema,
			outputFormat,
			fields,
			command,
		);

		const result = isDryRun ? undefined : await createBroadcast(validatedData, apiKey);

		displayResults({
			data: validatedData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcast Created Successfully',
					message: (data: unknown) => {
						const broadcast = data as { id: string };
						return `Broadcast ${broadcast.id} has been created and is ready to send.`;
					},
				},
				error: {
					title: 'Failed to Create Broadcast',
					message: 'There was an error creating the broadcast. Please check your input and try again.',
				},
				dryRun: {
					title: 'Dry Run: Broadcast Create',
					message: 'This would create a new broadcast with the provided configuration.',
				},
			},
		});
	} catch (error) {
		displayResults({
			data: {},
			result: { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
			fields,
			outputFormat: (allOptions.output as OutputFormat) || 'text',
			apiKey: '',
			isDryRun: false,
			operation: {
				success: { title: '', message: () => '' },
				error: { title: 'Unexpected Error', message: 'An unexpected error occurred' },
				dryRun: { title: 'DRY RUN Failed', message: 'Dry run failed' },
			},
		});
	}
}

export const broadcastCreateCommand = new Command('create')
	.alias('c')
	.description('Create a new broadcast to send to your audience')
	.action(handleCreateCommand);

// Add CLI options
registerFieldOptions(broadcastCreateCommand, fields);

const createExamples = [
	'$ resend-cli broadcast create --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --from="Acme <onboarding@resend.dev>" --subject="Weekly Newsletter" --html="<h1>Hello World</h1>"',
	'$ resend-cli broadcast create -a 78261eea-8f8b-4381-83c6-79fa7120f1cf -f onboarding@resend.dev -s "Product Update" --text="New features available!"',
	'$ resend-cli broadcast create --audience-id="..." --from="..." --subject="..." --html="..." --name="Campaign Name" --reply-to="support@example.com"',
	'$ resend-cli broadcast create --output json --audience-id="..." --from="..." --subject="..." --html="..." | jq \'.\'',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli broadcast create --audience-id="..." --from="..." --subject="..." --html="..."',
];

configureCustomHelp(broadcastCreateCommand, fields, createExamples);
