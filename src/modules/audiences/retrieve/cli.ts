import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { retrieveAudience } from './action.js';
import { displayFields, fields } from './fields.js';
import { RetrieveAudienceOptionsSchema, type RetrieveAudienceOptionsType } from './schema.js';

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
		const retrieveData = validateOptions<RetrieveAudienceOptionsType>(
			allOptions,
			RetrieveAudienceOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await retrieveAudience(retrieveData, apiKey);

		displayResults({
			data: retrieveData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Audience Retrieved Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Retrieve Audience',
					message: 'Audience retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - Audience Retrieval (validation only)',
					message: 'Validation successful! (Audience not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function createRetrieveAudienceCommand(): Command {
	// Register the retrieve subcommand
	const retrieveCommand = new Command('retrieve')
		.description('Retrieve an audience by ID from Resend API')
		.action(handleRetrieveCommand);

	// Add all the field options to the retrieve command
	registerFieldOptions(retrieveCommand, fields);

	const retrieveExamples = [
		'$ resend-cli audiences retrieve --id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli audiences retrieve -i "78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ resend-cli audiences retrieve --output json --id="78261eea-8f8b-4381-83c6-79fa7120f1cf" | jq \'.\'',
		'$ resend-cli audiences retrieve --dry-run --id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli audiences retrieve --id="78261eea-8f8b-4381-83c6-79fa7120f1cf"',
	];
	configureCustomHelp(retrieveCommand, fields, retrieveExamples);

	return retrieveCommand;
}
