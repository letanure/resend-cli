import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { deleteContact } from './action.js';
import { displayFields, fields } from './fields.js';
import { DeleteContactOptionsSchema, type DeleteContactOptionsType } from './schema.js';

// Main handler for delete command
async function handleDeleteCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate delete data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const deleteData = validateOptions<DeleteContactOptionsType>(
			options,
			DeleteContactOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await deleteContact(deleteData, apiKey);

		displayResults({
			data: deleteData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Contact Deleted Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Delete Contact',
					message: 'Contact deletion failed',
				},
				dryRun: {
					title: 'DRY RUN - Contact Deletion (validation only)',
					message: 'Validation successful! (Contact not deleted due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerDeleteContactCommand(contactsCommand: Command): void {
	const deleteCommand = createDeleteContactCommand();
	contactsCommand.addCommand(deleteCommand);
}

function createDeleteContactCommand(): Command {
	// Register the delete subcommand
	const deleteCommand = new Command('delete')
		.description('Delete a contact by ID or email from an audience in Resend API')
		.action(handleDeleteCommand);

	// Add all the field options to the delete command
	registerFieldOptions(deleteCommand, fields);

	const deleteExamples = [
		'$ resend-cli contacts delete --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947"',
		'$ resend-cli contacts delete -a "78261eea-8f8b-4381-83c6-79fa7120f1cf" -e "contact@example.com"',
		'$ resend-cli contacts delete --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --email="contact@example.com" --output json | jq \'.\'',
		'$ resend-cli contacts delete --dry-run --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli contacts delete --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --email="contact@example.com"',
	];
	configureCustomHelp(deleteCommand, fields, deleteExamples);

	return deleteCommand;
}
