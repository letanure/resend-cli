import { Command } from 'commander';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { sendBroadcast } from './action.js';
import { fields } from './fields.js';
import { type SendBroadcastData, sendBroadcastSchema } from './schema.js';

async function handleSendCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Convert CLI option names to schema field names
		const data: SendBroadcastData = {
			broadcastId: allOptions.broadcastId as string,
			scheduledAt: allOptions.scheduledAt as string,
		};

		// Validate the data
		const validationResult = sendBroadcastSchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await sendBroadcast(validationResult.data, apiKey);

		displayResults({
			data: validationResult.data,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcast Sent Successfully',
					message: (data: unknown) => {
						const broadcast = data as { id: string };
						return `Broadcast ${broadcast.id} has been sent successfully.`;
					},
				},
				error: {
					title: 'Failed to Send Broadcast',
					message: 'There was an error sending the broadcast. Please check your input and try again.',
				},
				dryRun: {
					title: 'Dry Run: Broadcast Send',
					message: 'This would send the broadcast with the provided configuration.',
				},
			},
		});
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

export const broadcastSendCommand = new Command('send')
	.alias('s')
	.description('Send a broadcast to your audience')
	.action(handleSendCommand);

// Add CLI options
fields.forEach((field) => {
	const flags = `${field.cliShortFlag}, ${field.cliFlag} <value>`;
	broadcastSendCommand.option(flags, field.helpText, field.placeholder);
});
