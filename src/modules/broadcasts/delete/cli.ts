import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { deleteBroadcast } from './action.js';
import { fields } from './fields.js';
import { type DeleteBroadcastData, deleteBroadcastSchema } from './schema.js';

async function handleDeleteCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Validate the data using unified validation
		const validatedData = validateOptions<DeleteBroadcastData>(
			allOptions,
			deleteBroadcastSchema,
			outputFormat,
			fields,
			command,
		);

		const result = isDryRun ? undefined : await deleteBroadcast(validatedData, apiKey);

		displayResults({
			data: validatedData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Broadcast Deleted Successfully',
					message: (data: unknown) => {
						const broadcast = data as { id: string; deleted: boolean };
						return `Broadcast ${broadcast.id} has been ${broadcast.deleted ? 'deleted' : 'processed'} successfully.`;
					},
				},
				error: {
					title: 'Failed to Delete Broadcast',
					message:
						'There was an error deleting the broadcast. Please check that the broadcast exists and is in draft status.',
				},
				dryRun: {
					title: 'Dry Run: Broadcast Delete',
					message: 'This would delete the broadcast. Note: Only draft or scheduled broadcasts can be deleted.',
				},
			},
		});
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

export function registerDeleteBroadcastCommand(broadcastsCommand: Command): void {
	const deleteCommand = createDeleteBroadcastCommand();
	broadcastsCommand.addCommand(deleteCommand);
}

function createDeleteBroadcastCommand(): Command {
	const deleteCommand = new Command('delete')
		.alias('d')
		.description('Delete a broadcast (only draft or scheduled broadcasts)')
		.action(handleDeleteCommand);

	registerFieldOptions(deleteCommand, fields);

	const deleteExamples = [
		'$ resend-cli broadcast delete --broadcast-id="559ac32e-9ef5-46fb-82a1-b76b840c0f7b"',
		'$ resend-cli broadcast delete -b 559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		'$ resend-cli broadcast delete --broadcast-id="..." --dry-run',
		'$ resend-cli broadcast delete --output json --broadcast-id="..." | jq \'.\'',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli broadcast delete --broadcast-id="..."',
	];

	configureCustomHelp(deleteCommand, fields, deleteExamples);

	return deleteCommand;
}

export const broadcastDeleteCommand = new Command('delete')
	.alias('d')
	.description('Delete a broadcast (only draft or scheduled broadcasts)')
	.action(handleDeleteCommand);
