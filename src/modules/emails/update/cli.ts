import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { updateEmail } from './action.js';
import { fields } from './fields.js';
import { UpdateEmailOptionsSchema, type UpdateEmailOptionsType } from './schema.js';

// Main handler for update command
async function handleUpdateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate update data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const updateData = validateOptions<UpdateEmailOptionsType>(
			options,
			UpdateEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		// TODO: Fix global --dry-run flag not being passed to subcommands
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await updateEmail(updateData, apiKey);

		displayResults({
			data: updateData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Email Updated Successfully',
					message: () => `Email ${updateData.id} scheduled time updated to ${updateData.scheduledAt}`,
				},
				error: {
					title: 'Failed to Update Email',
					message: 'Email update failed',
				},
				dryRun: {
					title: 'DRY RUN - Email Update (validation only)',
					message: 'Validation successful! (Email not updated due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerUpdateCommand(emailCommand: Command): void {
	// Register the update subcommand
	const updateCommand = emailCommand
		.command('update')
		.description('Update a scheduled email via Resend API')
		.action(handleUpdateCommand);

	// Add all the field options to the update command
	registerFieldOptions(updateCommand, fields);

	const updateExamples = [
		'$ resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z"',
		'$ resend-cli email update -i "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" -a "2024-12-25T09:00:00.000Z"',
		'$ resend-cli email update --output json --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z" | jq \'.\'',
		'$ resend-cli email update --dry-run --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli email update --id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" --scheduled-at="2024-08-05T11:52:01.858Z"',
	];

	configureCustomHelp(updateCommand, fields, updateExamples);
}
