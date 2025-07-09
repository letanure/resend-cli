import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { cancelEmail } from './action.js';
import { fields } from './fields.js';
import { CancelEmailOptionsSchema, type CancelEmailOptionsType } from './schema.js';

async function handleCancelCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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
		const validatedData = validateOptions<CancelEmailOptionsType>(
			allOptions,
			CancelEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await cancelEmail(validatedData.id, apiKey);

		// Display results
		displayResults({
			data: validatedData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Email Cancelled',
					message: () => `Email ${validatedData.id} has been cancelled`,
				},
				error: {
					title: 'Failed to Cancel Email',
					message: 'Failed to cancel email with Resend',
				},
				dryRun: {
					title: 'DRY RUN - Email Cancel',
					message: 'Validation successful! (Email not cancelled due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		displayResults({
			data: {},
			result: { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
			fields,
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

export const emailCancelCommand = new Command('cancel')
	.description('Cancel a scheduled email via Resend API')
	.action(handleCancelCommand);

registerFieldOptions(emailCancelCommand, fields);

const cancelExamples = [
	'$ resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
	'$ resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --output json',
	'$ resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --dry-run',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
	'$ resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" | jq \'.\'',
];

configureCustomHelp(emailCancelCommand, fields, cancelExamples);
