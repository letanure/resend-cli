import { Command } from 'commander';
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

		// Convert CLI option names to schema field names
		const data: DeleteBroadcastData = {
			broadcastId: allOptions.broadcastId as string,
		};

		// Validate the data
		const validationResult = deleteBroadcastSchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await deleteBroadcast(validationResult.data, apiKey);

		displayResults({
			data: validationResult.data,
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

export const broadcastDeleteCommand = new Command('delete')
	.alias('d')
	.description('Delete a broadcast (only draft or scheduled broadcasts)')
	.action(handleDeleteCommand);

// Add CLI options
fields.forEach((field) => {
	const flags = `${field.cliShortFlag}, ${field.cliFlag} <value>`;
	broadcastDeleteCommand.option(flags, field.helpText, field.placeholder);
});
