import type { Command } from 'commander';
import type { CreateEmailOptions } from 'resend';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { sendEmail } from './send/action.js';
import { fields } from './send/fields.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './send/schema.js';

// Main handler for send command
async function handleSendCommand(options: Record<string, unknown>): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Extract output format and validate email data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const emailData = validateOptions<CreateEmailOptionsType>(options, CreateEmailOptionsSchema, outputFormat);

		// Check if dry-run mode is enabled
		// TODO: Fix global --dry-run flag not being passed to subcommands
		const isDryRun = Boolean(options.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await sendEmail(emailData as CreateEmailOptions, apiKey);

		displayResults({
			data: emailData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Email sent successfully:',
					message: (data: unknown) => {
						const emailResult = data as { id: string };
						return `Email sent! ID: ${emailResult.id}`;
					},
				},
				error: {
					title: 'Failed to send email:',
					message: 'Email sending failed',
				},
				dryRun: {
					title: 'DRY RUN - Email data (validation only):',
					message: 'Validation successful! (Email not sent due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerEmailCommands(emailCommand: Command) {
	// Register the send subcommand
	const sendCommand = emailCommand
		.command('send')
		.description('Send an email via Resend API')
		.action(handleSendCommand);

	// Add all the field options to the send command (this now includes error handling)
	registerFieldOptions(sendCommand, fields);

	const examples = [
		'$ resend-cli email send --from="Acme <onboarding@resend.dev>" --to="user@example.com" --subject="Hello World" --html="<h1>it works!</h1>"',
		'$ resend-cli email send -f onboarding@resend.dev -t user@example.com -s "Hello World" --text="it works!"',
		'$ resend-cli email send --output json --from="..." --to="..." --subject="..." --html="..." | jq \'.\'',
		"$ EMAIL_ID=$(resend-cli email send --output json ... | jq -r '.data.id')",
		'$ RESEND_API_KEY="re_xxxxx" resend-cli email send --from="..." --to="..." --subject="..." --html="..."',
	];
	configureCustomHelp(sendCommand, fields, examples);
}
