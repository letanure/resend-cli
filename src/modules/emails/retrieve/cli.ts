import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { getEmail } from './action.js';
import { displayFields, fields } from './fields.js';
import { GetEmailOptionsSchema, type GetEmailOptionsType } from './schema.js';

async function handleRetrieveCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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

		// Validate the data using unified validation
		const validatedData = validateOptions<GetEmailOptionsType>(
			allOptions,
			GetEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await getEmail(validatedData.id, apiKey);

		// Display results
		displayResults({
			data: validatedData,
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Email Retrieved',
					message: () => '',
				},
				error: {
					title: 'Failed to Retrieve Email',
					message: 'Failed to retrieve email from Resend',
				},
				dryRun: {
					title: 'DRY RUN - Email Retrieve',
					message: 'Validation successful! (Email not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		displayResults({
			data: {},
			result: { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
			fields: displayFields,
			outputFormat: (allOptions.output as OutputFormat) || 'text',
			apiKey: '',
			isDryRun: false,
			operation: {
				success: { title: '', message: () => '' },
				error: { title: 'Unexpected Error', message: 'An unexpected error occurred' },
				dryRun: { title: 'DRY RUN Failed', message: 'Dry run failed' },
			},
		});
	}
}

export const emailRetrieveCommand = new Command('retrieve')
	.description('Retrieve an email by ID from Resend API')
	.action(handleRetrieveCommand);

registerFieldOptions(emailRetrieveCommand, fields);

const retrieveExamples = [
	'$ resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"',
	'$ resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f" --output json',
	'$ resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f" --dry-run',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"',
	'$ resend-cli email retrieve --id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f" | jq \'.\'',
];

configureCustomHelp(emailRetrieveCommand, fields, retrieveExamples);
