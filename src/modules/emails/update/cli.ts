import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { updateEmail } from './action.js';
import { fields } from './fields.js';
import { UpdateEmailOptionsSchema, type UpdateEmailOptionsType } from './schema.js';

async function handleUpdateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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
		const validatedData = validateOptions<UpdateEmailOptionsType>(
			allOptions,
			UpdateEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await updateEmail(validatedData, apiKey);

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
					title: 'Email Updated',
					message: () => `Email ${validatedData.id} scheduled time updated to ${validatedData.scheduledAt}`,
				},
				error: {
					title: 'Failed to Update Email',
					message: 'Failed to update email with Resend',
				},
				dryRun: {
					title: 'DRY RUN - Email Update',
					message: 'Validation successful! (Email not updated due to --dry-run flag)',
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

export const emailUpdateCommand = new Command('update')
	.description('Update a scheduled email via Resend API')
	.action(handleUpdateCommand);

registerFieldOptions(emailUpdateCommand, fields);

const updateExamples = [
	'$ resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z"',
	'$ resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z" --output json',
	'$ resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z" --dry-run',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z"',
	'$ resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z" | jq \'.\'',
];

configureCustomHelp(emailUpdateCommand, fields, updateExamples);
