import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { deleteApiKey } from './action.js';
import { fields } from './fields.js';
import { type DeleteApiKeyData, deleteApiKeySchema } from './schema.js';

async function handleDeleteCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	// Get global options from the root program (need to go up two levels)
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	// Merge local and global options
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Validate the data using the standard validation approach
		const validatedData = validateOptions<DeleteApiKeyData>(
			allOptions,
			deleteApiKeySchema,
			outputFormat,
			fields,
			command,
		);

		const result = isDryRun ? undefined : await deleteApiKey(validatedData, apiKey);

		displayResults({
			data: validatedData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'API Key Deleted Successfully',
					message: (data: unknown) => {
						const deleteData = data as DeleteApiKeyData;
						return `API key ${deleteData.api_key_id} has been permanently deleted`;
					},
				},
				error: {
					title: 'Failed to Delete API Key',
					message: 'API key deletion failed',
				},
				dryRun: {
					title: 'DRY RUN - API Key Delete (validation only)',
					message: 'Validation successful! (API key not deleted due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerDeleteApiKeyCommand(apiKeysCommand: Command): void {
	const deleteCommand = createDeleteApiKeyCommand();
	apiKeysCommand.addCommand(deleteCommand);
}

function createDeleteApiKeyCommand(): Command {
	const deleteCommand = new Command('delete')
		.description('Delete an existing API key from Resend')
		.action((options: Record<string, unknown>, command: Command) => handleDeleteCommand(options, command));

	registerFieldOptions(deleteCommand, fields);

	const deleteExamples = [
		'$ resend-cli apikeys delete --api-key-id "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"',
		'$ resend-cli apikeys delete -i "b6d24b8e-af0b-4c3c-be0c-359bbd97381e" --output json',
		'$ resend-cli apikeys delete --api-key-id "b6d24b8e-af0b-4c3c-be0c-359bbd97381e" --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli apikeys delete -i "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"',
	];

	configureCustomHelp(deleteCommand, fields, deleteExamples);

	return deleteCommand;
}
