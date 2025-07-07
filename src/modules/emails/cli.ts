import type { Command } from 'commander';
import { displayCLIResults, registerFieldOptions, validateEnvironmentVariable, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import type { OutputFormat } from '@/utils/output.js';
import { fields } from './send/fields.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './send/schema.js';

// Main handler for send command
async function handleSendCommand(options: Record<string, unknown>): Promise<void> {
	try {
		const apiKey = validateEnvironmentVariable(
			'RESEND_API_KEY',
			'https://resend.com/docs/dashboard/api-keys/introduction',
		);

		// Extract output format and validate email data
		const outputFormat = (options.output as OutputFormat) || 'text';
		const emailData = validateOptions<CreateEmailOptionsType>(options, CreateEmailOptionsSchema, outputFormat);

		// Display the results
		displayCLIResults(
			emailData as Record<string, unknown>,
			fields,
			outputFormat,
			'Parsed email data:',
			{ 'API Key': `${apiKey.substring(0, 10)}...` },
			'Command parsed successfully! (Email not sent - for testing)',
		);

		// For now, just log the data instead of sending
		// const result = await sendEmailAction(emailData, apiKey);
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
