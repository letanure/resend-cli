import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
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

		// Validate the data using unified validation
		const validatedData = validateOptions<SendBroadcastData>(
			allOptions,
			sendBroadcastSchema,
			outputFormat,
			fields,
			command,
		);

		const result = isDryRun ? undefined : await sendBroadcast(validatedData, apiKey);

		displayResults({
			data: validatedData,
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

export function registerSendBroadcastCommand(broadcastsCommand: Command): void {
	const sendCommand = createSendBroadcastCommand();
	broadcastsCommand.addCommand(sendCommand);
}

function createSendBroadcastCommand(): Command {
	const sendCommand = new Command('send')
		.alias('s')
		.description('Send a broadcast to your audience')
		.action(handleSendCommand);

	registerFieldOptions(sendCommand, fields);

	const sendExamples = [
		'$ resend-cli broadcast send --broadcast-id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
		'$ resend-cli broadcast send -b 49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
		'$ resend-cli broadcast send --broadcast-id="..." --scheduled-at="in 1 hour"',
		'$ resend-cli broadcast send --broadcast-id="..." --scheduled-at="2024-12-25T10:00:00Z"',
		'$ resend-cli broadcast send --output json --broadcast-id="..." | jq \'.\'',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli broadcast send --broadcast-id="..."',
	];

	configureCustomHelp(sendCommand, fields, sendExamples);

	return sendCommand;
}

export const broadcastSendCommand = new Command('send')
	.alias('s')
	.description('Send a broadcast to your audience')
	.action(handleSendCommand);
