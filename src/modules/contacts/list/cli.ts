import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { listContacts } from './action.js';
import { displayFields, fields } from './fields.js';
import { ListContactsOptionsSchema, type ListContactsOptionsType } from './schema.js';

// Main handler for list command
async function handleListCommand(options: Record<string, unknown>): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate list data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const listData = validateOptions<ListContactsOptionsType>(options, ListContactsOptionsSchema, outputFormat);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await listContacts(listData, apiKey);

		displayResults({
			data: listData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Contact Search Completed',
					message: (data: unknown) => {
						const contactData = data as { data: Array<unknown> };
						if (contactData.data && contactData.data.length === 0) {
							return 'No contacts found in this audience (0 results).';
						}
						return `Found ${contactData.data.length} contact${contactData.data.length === 1 ? '' : 's'}`;
					},
				},
				error: {
					title: 'Failed to List Contacts',
					message: 'Contact listing failed',
				},
				dryRun: {
					title: 'DRY RUN - Contact List (validation only)',
					message: 'Validation successful! (Contacts not listed due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerListContactsCommand(contactCommand: Command) {
	// Register the list subcommand
	const listCommand = contactCommand
		.command('list')
		.description('List all contacts in an audience')
		.action(handleListCommand);

	// Add all the field options to the list command
	registerFieldOptions(listCommand, fields);

	const listExamples = [
		'$ resend-cli contact list --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli contact list -a "78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli contact list --output json --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" | jq \'.\'',
		'$ resend-cli contact list --dry-run --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli contact list --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
	];
	configureCustomHelp(listCommand, fields, listExamples);
}
