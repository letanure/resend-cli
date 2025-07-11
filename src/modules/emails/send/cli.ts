import { Command } from 'commander';
import type { CreateEmailOptions } from 'resend';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { sendEmail } from './action.js';
import { fields } from './fields.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './schema.js';

// Main handler for send command
async function handleSendCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	// Get global options from the root program (need to go up two levels)
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	// Merge local and global options
	const allOptions = { ...globalOptions, ...options };

	try {
		const apiKey = getResendApiKey(allOptions.apiKey as string);

		// Extract output format and validate email data
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const emailData = validateOptions<CreateEmailOptionsType>(
			allOptions,
			CreateEmailOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

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
					title: 'Email Sent Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Send Email',
					message: 'Email sending failed',
				},
				dryRun: {
					title: 'DRY RUN - Email Send (validation only)',
					message: 'Validation successful! (Email not sent due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export const emailSendCommand = new Command('send')
	.description('Send an email via Resend API')
	.action(handleSendCommand);

// Add all the field options to the send command (this now includes error handling)
registerFieldOptions(emailSendCommand, fields);

const sendExamples = [
	'$ resend-cli email send --from="Acme <onboarding@resend.dev>" --to="user@example.com" --subject="Hello World" --html="<h1>it works!</h1>"',
	'$ resend-cli email send -f onboarding@resend.dev -t user@example.com -s "Hello World" --text="it works!"',
	'$ resend-cli email send --output json --from="..." --to="..." --subject="..." --html="..." | jq \'.\'',
	"$ EMAIL_ID=$(resend-cli email send --output json ... | jq -r '.data.id')",
	'$ RESEND_API_KEY="re_xxxxx" resend-cli email send --from="..." --to="..." --subject="..." --html="..."',
	'$ resend-cli email send --api-key="re_xxxxx" --from="..." --to="..." --subject="..." --html="..."',
];
configureCustomHelp(emailSendCommand, fields, sendExamples);
