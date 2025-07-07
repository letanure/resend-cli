import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { deleteAudience } from './action.js';
import { displayFields, fields } from './fields.js';
import { DeleteAudienceOptionsSchema, type DeleteAudienceOptionsType } from './schema.js';

// Main handler for delete command
async function handleDeleteCommand(options: Record<string, unknown>): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate delete data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const deleteData = validateOptions<DeleteAudienceOptionsType>(options, DeleteAudienceOptionsSchema, outputFormat);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
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
