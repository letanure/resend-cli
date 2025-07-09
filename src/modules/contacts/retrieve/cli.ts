import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { retrieveContact } from './action.js';
import { displayFields, fields } from './fields.js';
import { RetrieveContactOptionsSchema, type RetrieveContactOptionsType } from './schema.js';

// Main handler for retrieve command
async function handleRetrieveCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate retrieve data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const retrieveData = validateOptions<RetrieveContactOptionsType>(
			options,
			RetrieveContactOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await retrieveContact(retrieveData, apiKey);

		displayResults({
			data: retrieveData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Contact Retrieved Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Retrieve Contact',
					message: 'Contact retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - Contact Retrieval (validation only)',
					message: 'Validation successful! (Contact not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerRetrieveContactCommand(contactCommand: Command) {
	// Register the retrieve subcommand
	const retrieveCommand = contactCommand
		.command('retrieve')
		.description('Retrieve a contact by ID or email from an audience')
		.action(handleRetrieveCommand);

	// Add all the field options to the retrieve command
	registerFieldOptions(retrieveCommand, fields);

	const retrieveExamples = [
		'$ resend-cli contact retrieve --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947"',
		'$ resend-cli contact retrieve -a "78261eea-8f8b-4381-83c6-79fa7120f1cf" -i "479e3145-dd38-476b-932c-529ceb705947"',
		'$ resend-cli contact retrieve --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --email="user@example.com"',
		'$ resend-cli contact retrieve -a "78261eea-8f8b-4381-83c6-79fa7120f1cf" -e "user@example.com"',
		'$ resend-cli contact retrieve --output json --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947" | jq \'.\'',
		'$ resend-cli contact retrieve --dry-run --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --email="user@example.com"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli contact retrieve --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947"',
	];
	configureCustomHelp(retrieveCommand, fields, retrieveExamples);
}
