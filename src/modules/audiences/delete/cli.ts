import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { deleteAudience } from './action.js';
import { displayFields, fields } from './fields.js';
import { DeleteAudienceOptionsSchema, type DeleteAudienceOptionsType } from './schema.js';

async function handleDeleteCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Get global options from the root program (need to go up two levels)
		const rootProgram = command.parent?.parent;
		const globalOptions = rootProgram?.opts() || {};
		// Merge local and global options
		const allOptions = { ...globalOptions, ...options };

		// Extract output format and validate delete data
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const deleteData = validateOptions<DeleteAudienceOptionsType>(
			allOptions,
			DeleteAudienceOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		const isDryRun = Boolean(allOptions.dryRun);

		const result = isDryRun ? undefined : await deleteAudience(deleteData, apiKey);

		displayResults({
			data: deleteData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Audience Deleted Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Delete Audience',
					message: 'Audience deletion failed',
				},
				dryRun: {
					title: 'DRY RUN - Audience Deletion (validation only)',
					message: 'Validation successful! (Audience not deleted due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function createDeleteAudienceCommand(): Command {
	// Register the delete subcommand
	const deleteCommand = new Command('delete')
		.description('Delete an audience by ID from Resend API')
		.action(handleDeleteCommand);

	// Add all the field options to the delete command
	registerFieldOptions(deleteCommand, fields);

	const deleteExamples = [
		'$ resend-cli audiences delete --id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli audiences delete -i "78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli audiences delete --output json --id="78261eea-8f8b-4381-83c6-79fa7120f1cf" | jq \'.\'',
		'$ resend-cli audiences delete --dry-run --id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli audiences delete --id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
	];
	configureCustomHelp(deleteCommand, fields, deleteExamples);

	return deleteCommand;
}
