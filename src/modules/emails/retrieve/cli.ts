import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { getEmail } from './action.js';
import { displayFields, fields } from './fields.js';
import { GetEmailOptionsSchema, type GetEmailOptionsType } from './schema.js';

// Main handler for retrieve command
async function handleRetrieveCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Get global options from the root program (need to go up two levels)
		const rootProgram = command.parent?.parent;
		const globalOptions = rootProgram?.opts() || {};
		// Merge local and global options
		const allOptions = { ...globalOptions, ...options };

		// Extract output format and validate retrieve data
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const retrieveData = validateOptions<GetEmailOptionsType>(
			allOptions,
			GetEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await getEmail(retrieveData.id, apiKey);

		displayResults({
			data: retrieveData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Email Retrieved Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Retrieve Email',
					message: 'Email retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - Email Retrieval (validation only)',
					message: 'Validation successful! (Email not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerRetrieveCommand(emailCommand: Command) {
	// Register the retrieve subcommand
	const retrieveCommand = emailCommand
		.command('retrieve')
		.description('Retrieve an email by ID from Resend API')
		.action(handleRetrieveCommand);

	// Add all the field options to the retrieve command
	registerFieldOptions(retrieveCommand, fields);

	const retrieveExamples = [
		'$ resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"',
		'$ resend-cli email retrieve -i "402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"',
		'$ resend-cli email retrieve --output json --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f" | jq \'.\'',
		'$ resend-cli email retrieve --dry-run --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"',
	];
	configureCustomHelp(retrieveCommand, fields, retrieveExamples);
}
