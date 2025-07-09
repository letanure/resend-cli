import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { cancelEmail } from './action.js';
import { fields } from './fields.js';
import { CancelEmailOptionsSchema, type CancelEmailOptionsType } from './schema.js';

// Main handler for cancel command
async function handleCancelCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate cancel data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const cancelData = validateOptions<CancelEmailOptionsType>(
			options,
			CancelEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		// TODO: Fix global --dry-run flag not being passed to subcommands
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await cancelEmail(cancelData.id, apiKey);

		displayResults({
			data: cancelData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Email Cancelled Successfully',
					message: () => `Email ${cancelData.id} has been cancelled`,
				},
				error: {
					title: 'Failed to Cancel Email',
					message: 'Email cancellation failed',
				},
				dryRun: {
					title: 'DRY RUN - Email Cancellation (validation only)',
					message: 'Validation successful! (Email not cancelled due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerCancelCommand(emailCommand: Command): void {
	// Register the cancel subcommand
	const cancelCommand = emailCommand
		.command('cancel')
		.description('Cancel a scheduled email via Resend API')
		.action(handleCancelCommand);

	// Add all the field options to the cancel command
	registerFieldOptions(cancelCommand, fields);

	const cancelExamples = [
		'$ resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
		'$ resend-cli email cancel -i "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
		'$ resend-cli email cancel --output json --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" | jq \'.\'',
		'$ resend-cli email cancel --dry-run --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli email cancel --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"',
	];

	configureCustomHelp(cancelCommand, fields, cancelExamples);
}
