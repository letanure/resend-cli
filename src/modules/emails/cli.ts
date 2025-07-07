import type { Command } from 'commander';
import { displayCLIResults, registerFieldOptions, validateEnvironmentVariable, validateOptions } from '@/utils/cli.js';
import { fields } from './send/fields.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './send/schema.js';

// Main handler for send command
async function handleSendCommand(options: unknown): Promise<void> {
	try {
		const apiKey = validateEnvironmentVariable(
			'RESEND_API_KEY',
			'https://resend.com/docs/dashboard/api-keys/introduction',
		);
		const emailData = validateOptions<CreateEmailOptionsType>(options, CreateEmailOptionsSchema);

		// Display the results
		displayCLIResults(emailData as Record<string, unknown>, fields, 'Parsed email data:', {
			'API Key': `${apiKey.substring(0, 10)}...`,
		});

		console.log('Command parsed successfully! (Email not sent - for testing)');

		// For now, just log the data instead of sending
		// const result = await sendEmailAction(emailData, apiKey);
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerEmailCommands(emailCommand: Command) {
	// Register the send subcommand
	const sendCommand = emailCommand.command('send').description('Send an email').action(handleSendCommand);

	// Add all the field options to the send command
	registerFieldOptions(sendCommand, fields);

	// Add help examples
	sendCommand.addHelpText(
		'after',
		`
Examples:
  $ resend-cli email send --from="Acme <onboarding@resend.dev>" --to="user@example.com" --subject="Hello World" --html="<h1>it works!</h1>"
  $ resend-cli email send -f onboarding@resend.dev -t user@example.com -s "Hello World" --text="it works!"
  $ RESEND_API_KEY="re_xxxxx" resend-cli email send --from="..." --to="..." --subject="..." --html="..."
`,
	);
}
