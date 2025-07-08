import { Command } from 'commander';
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

		// Validate required data
		const data: DeleteApiKeyData = {
			api_key_id: allOptions.apiKeyId as string,
		};

		// Validate the data
		const validationResult = deleteApiKeySchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await deleteApiKey(apiKey, validationResult.data);

		displayResults({
			data: validationResult.data,
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
		.action(handleDeleteCommand);

	// Add field-based options
	for (const field of fields) {
		if (field.cliFlag) {
			const optionFlag = field.cliShortFlag ? `${field.cliShortFlag}, ${field.cliFlag}` : field.cliFlag;
			deleteCommand.option(`${optionFlag} <value>`, field.helpText);
		}
	}

	const deleteExamples = [
		'$ resend-cli apiKeys delete --api-key-id "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"',
		'$ resend-cli apiKeys delete -i "b6d24b8e-af0b-4c3c-be0c-359bbd97381e" --output json',
		'$ resend-cli apiKeys delete --api-key-id "b6d24b8e-af0b-4c3c-be0c-359bbd97381e" --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli apiKeys delete -i "b6d24b8e-af0b-4c3c-be0c-359bbd97381e"',
	];

	deleteCommand.addHelpText('after', `\nExamples:\n${deleteExamples.map((example) => `  ${example}`).join('\n')}`);

	return deleteCommand;
}
