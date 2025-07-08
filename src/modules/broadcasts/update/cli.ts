import { Command } from 'commander';
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

		// Convert CLI option names to schema field names
		const data: UpdateBroadcastData = {
			broadcastId: allOptions.broadcastId as string,
			audienceId: allOptions.audienceId as string,
			from: allOptions.from as string,
			subject: allOptions.subject as string,
			replyTo: allOptions.replyTo as string,
			html: allOptions.html as string,
			text: allOptions.text as string,
			name: allOptions.name as string,
		};

		// Validate the data
		const validationResult = updateBroadcastSchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await updateBroadcast(validationResult.data, apiKey);

		displayResults({
			data: validationResult.data,
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

export const broadcastUpdateCommand = new Command('update')
	.alias('u')
	.description('Update a broadcast to send to your audience')
	.action(handleUpdateCommand);

// Add CLI options
fields.forEach((field) => {
	const flags = `${field.cliShortFlag}, ${field.cliFlag} <value>`;
	broadcastUpdateCommand.option(flags, field.helpText, field.placeholder);
});
