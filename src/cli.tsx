#!/usr/bin/env node
import { render } from 'ink';
import meow from 'meow';
// import { sendEmailAction } from './emails/send/action.js';
// import { flagsToSendEmailData, validateSendEmailArgs } from './emails/send/validation.js';
import { AppMain } from './AppMain.js';

// Main CLI setup
const cli = meow(
	`
	Usage
	  $ resend-cli [command] [subcommand] [options]
	  $ resend-cli (no arguments for TUI mode)

	Commands
	  email send            Send an email
	  email send-batch      Send multiple emails (coming soon)
	  email retrieve        Retrieve email information (coming soon)
	  email update          Update email properties (coming soon)
	  email cancel          Cancel scheduled email (coming soon)
	  domains create        Create a domain (coming soon)
	  domains retrieve      Get domain information (coming soon)
	  domains verify        Verify domain ownership (coming soon)
	  domains update        Update domain settings (coming soon)
	  domains list          List all domains (coming soon)
	  domains delete        Delete a domain (coming soon)

	Options
	  --help, -h            Show help
	  --version, -v         Show version

	Examples
	  $ resend-cli email send --from="sender@domain.com" --to="user@example.com" --subject="Hello" --html="<h1>Hello World</h1>"
	  $ resend-cli (starts interactive TUI mode)
`,
	{
		importMeta: import.meta,
		flags: {
			// We'll dynamically add flags based on the command
		},
	},
);

const [command, subcommand] = cli.input;

// CLI Mode: handle structured commands
if (command === 'email' && subcommand === 'send') {
	// // Import the send email CLI configuration
	// const { sendEmailCli } = await import('./emails/send/args.js');
	// // Parse arguments specifically for send email command
	// const sendArgs = process.argv.slice(4); // Skip 'node', 'cli.js', 'email', 'send'
	// const sendCli = meow('', {
	// 	importMeta: import.meta,
	// 	argv: sendArgs,
	// 	// biome-ignore lint/suspicious/noExplicitAny: Meow flag type compatibility
	// 	flags: sendEmailCli.flags as any,
	// });
	// // Validate send email arguments
	// // biome-ignore lint/suspicious/noExplicitAny: Meow flag type compatibility
	// const validationErrors = validateSendEmailArgs(sendCli.flags as any);
	// if (validationErrors.length > 0) {
	// 	console.error('❌ Validation errors:');
	// 	for (const error of validationErrors) {
	// 		console.error(`  • ${error}`);
	// 	}
	// 	console.error('\nUse --help for usage information');
	// 	process.exit(1);
	// }
	// // Convert CLI flags to email data using schema
	// // biome-ignore lint/suspicious/noExplicitAny: Meow flag type compatibility
	// const emailData = flagsToSendEmailData(sendCli.flags as any);
	// // Show what we're about to send
	// console.log('📤 Sending email...');
	// console.log('📨 From:', emailData.from);
	// console.log('📬 To:', Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to);
	// console.log('📝 Subject:', emailData.subject);
	// console.log('');
	// try {
	// 	// Validate required fields exist
	// 	if (!emailData.from || !emailData.to || !emailData.subject) {
	// 		console.error('❌ Missing required fields after validation');
	// 		process.exit(1);
	// 	}
	// 	const result = await sendEmailAction({
	// 		from: emailData.from,
	// 		to: emailData.to,
	// 		subject: emailData.subject,
	// 		html: emailData.html,
	// 		text: emailData.text,
	// 		apiKey: emailData.apiKey,
	// 	});
	// 	if (result.success) {
	// 		console.log('✅', result.message);
	// 		if (result.data) {
	// 			console.log('📧 Email ID:', result.data.id);
	// 			console.log('🕐 Sent at:', new Date().toISOString());
	// 		}
	// 	} else {
	// 		console.error('❌', result.error);
	// 		process.exit(1);
	// 	}
	// } catch (error) {
	// 	console.error('❌ Unexpected error:', error instanceof Error ? error.message : error);
	// 	process.exit(1);
	// }
	// } else if (command && subcommand) {
	// 	// Handle other feature commands (not implemented yet)
	// 	console.error(`❌ Command "${command} ${subcommand}" is not implemented yet.`);
	// 	console.error('Available commands:');
	// 	console.error('  email send        Send an email');
	// 	console.error('');
	// 	console.error('Run without arguments to use the interactive TUI mode.');
	// 	process.exit(1);
	// } else if (command) {
	// 	// Handle single commands or show help for command groups
	// 	if (command === 'email' || command === 'domains') {
	// 		console.error(`❌ "${command}" requires a subcommand.`);
	// 		console.error(`Available ${command} commands:`);
	// 		if (command === 'email') {
	// 			console.error('  send, send-batch, retrieve, update, cancel');
	// 		} else {
	// 			console.error('  create, retrieve, verify, update, list, delete');
	// 		}
	// 		process.exit(1);
	// 	} else {
	// 		console.error(`❌ Unknown command: ${command}`);
	// 		console.error('Run --help to see available commands.');
	// 		process.exit(1);
	// 	}
} else {
	// TUI mode - show interactive interface
	render(<AppMain />);
}
