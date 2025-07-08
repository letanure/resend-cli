import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { createContact } from './action.js';
import { fields } from './fields.js';
import { CreateContactOptionsSchema, type CreateContactOptionsType } from './schema.js';

// Main handler for create command
async function handleCreateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	// Get global options from the root program (need to go up two levels)
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	// Merge local and global options
	const allOptions = { ...globalOptions, ...options };

	try {
		// Extract output format and convert boolean strings to booleans
		const outputFormat = (allOptions.output as OutputFormat) || 'text';

		// Convert string boolean values to actual booleans
		const processedOptions = { ...allOptions };
		if (typeof processedOptions.unsubscribed === 'string') {
			processedOptions.unsubscribed = ['true', 'yes', '1'].includes(processedOptions.unsubscribed.toLowerCase());
		}

		const contactData = validateOptions(
			processedOptions,
			CreateContactOptionsSchema,
			outputFormat,
		) as CreateContactOptionsType;

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

		// Get API key only if not in dry run mode
		const apiKey = isDryRun ? 'dummy' : getResendApiKey();

		// Use generic displayResults function
		const result = isDryRun ? undefined : await createContact(contactData, apiKey);

		displayResults({
			data: contactData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Contact Created Successfully',
					message: (data) => `Contact ID: ${(data as { id: string })?.id || 'Unknown'}`,
				},
				error: {
					title: 'Failed to Create Contact',
					message: 'Contact creation failed',
				},
				dryRun: {
					title: 'DRY RUN - Contact Create (validation only)',
					message: 'Validation successful! (Contact not created due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

		if ((allOptions.output as OutputFormat) === 'json') {
			console.log(
				JSON.stringify(
					{
						success: false,
						error: errorMessage,
					},
					null,
					2,
				),
			);
		} else {
			console.error('Unexpected error:', errorMessage);
		}
		process.exit(1);
	}
}

export function registerCreateContactCommand(contactsCommand: Command) {
	// Register the create subcommand
	const createCommand = contactsCommand
		.command('create')
		.description('Create a contact in an audience via Resend API')
		.action(handleCreateCommand);

	// Add all the field options to the create command
	registerFieldOptions(createCommand, fields);

	const createExamples = [
		'$ resend-cli contacts create --email="user@example.com" --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli contacts create -e user@example.com -a 78261eea-8f8b-4381-83c6-79fa7120f1cf --first-name="Steve" --last-name="Wozniak"',
		'$ resend-cli contacts create --email="user@example.com" --audience-id="..." --unsubscribed=true',
		'$ resend-cli contacts create --output json --email="..." --audience-id="..." | jq \'.\'',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli contacts create --email="..." --audience-id="..."',
	];
	configureCustomHelp(createCommand, fields, createExamples);
}
