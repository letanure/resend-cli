import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { updateBroadcast } from './action.js';
import { fields } from './fields.js';
import { type UpdateBroadcastData, updateBroadcastSchema } from './schema.js';

async function handleUpdateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Validate the data using unified validation
		const validatedData = validateOptions<UpdateBroadcastData>(
			allOptions,
			updateBroadcastSchema,
			outputFormat,
			fields,
			command,
		);

		const result = isDryRun ? undefined : await updateBroadcast(validatedData, apiKey);

		displayResults({
			data: validatedData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcast Updated Successfully',
					message: (data: unknown) => {
						const broadcast = data as { id: string };
						return `Broadcast ${broadcast.id} has been updated successfully.`;
					},
				},
				error: {
					title: 'Failed to Update Broadcast',
					message: 'There was an error updating the broadcast. Please check your input and try again.',
				},
				dryRun: {
					title: 'Dry Run: Broadcast Update',
					message: 'This would update the broadcast with the provided configuration.',
				},
			},
		});
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

export function registerUpdateBroadcastCommand(broadcastsCommand: Command): void {
	const updateCommand = createUpdateBroadcastCommand();
	broadcastsCommand.addCommand(updateCommand);
}

function createUpdateBroadcastCommand(): Command {
	const updateCommand = new Command('update')
		.alias('u')
		.description('Update a broadcast to send to your audience')
		.action(handleUpdateCommand);

	registerFieldOptions(updateCommand, fields);

	const updateExamples = [
		'$ resend-cli broadcast update --broadcast-id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --subject="Updated Subject"',
		'$ resend-cli broadcast update -b 49a3999c-0ce1-4ea6-ab68-afcd6dc2e794 -s "New Subject" --html="<h1>Updated content</h1>"',
		'$ resend-cli broadcast update --broadcast-id="..." --from="new-sender@example.com" --reply-to="support@example.com"',
		'$ resend-cli broadcast update --broadcast-id="..." --name="Updated Campaign Name"',
		'$ resend-cli broadcast update --output json --broadcast-id="..." --subject="..." | jq \'.\'',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli broadcast update --broadcast-id="..." --subject="..."',
	];

	configureCustomHelp(updateCommand, fields, updateExamples);

	return updateCommand;
}

export const broadcastUpdateCommand = new Command('update')
	.alias('u')
	.description('Update a broadcast to send to your audience')
	.action(handleUpdateCommand);
