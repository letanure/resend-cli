import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { updateContact } from './action.js';
import { fields } from './fields.js';
import { type UpdateContactData, updateContactSchema } from './schema.js';

async function handleUpdateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';

		// Convert string boolean values to actual booleans
		const processedOptions = { ...allOptions };
		if (typeof processedOptions.unsubscribed === 'string') {
			processedOptions.unsubscribed = ['true', 'yes', '1'].includes(processedOptions.unsubscribed.toLowerCase());
		}

		const contactData = validateOptions(
			processedOptions,
			updateContactSchema,
			outputFormat,
			fields,
			command,
		) as UpdateContactData;

		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		const result = isDryRun ? undefined : await updateContact(contactData, apiKey);

		displayResults({
			data: contactData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Contact Updated Successfully',
					message: (data: unknown) => {
						const contact = data as { id: string };
						return `Contact ${contact.id} has been updated successfully.`;
					},
				},
				error: {
					title: 'Failed to Update Contact',
					message: 'There was an error updating the contact. Please check your input and try again.',
				},
				dryRun: {
					title: 'Dry Run: Contact Update',
					message: 'This would update the contact with the provided configuration.',
				},
			},
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

		if ((allOptions.output as OutputFormat) === 'json') {
			console.log(
				JSON.stringify(
					{
						success: false,
						error: errorMessage,
					},
					null,
					2,
				),
			);
		} else {
			console.error('Unexpected error:', errorMessage);
		}
		process.exit(1);
	}
}

export function registerUpdateContactCommand(contactsCommand: Command): void {
	const updateCommand = new Command('update')
		.alias('u')
		.description('Update an existing contact')
		.action(handleUpdateCommand);

	// Add all the field options to the update command
	registerFieldOptions(updateCommand, fields);

	const updateExamples = [
		'$ resend-cli contacts update --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947" --first-name="Jane"',
		'$ resend-cli contacts update -a "78261eea-8f8b-4381-83c6-79fa7120f1cf" -i "479e3145-dd38-476b-932c-529ceb705947" --email="jane@example.com"',
		'$ resend-cli contacts update --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947" --unsubscribed=true',
		'$ resend-cli contacts update --output json --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947" --first-name="Jane" | jq \'.\'',
		'$ resend-cli contacts update --dry-run --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947" --first-name="Jane"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli contacts update --audience-id="78261eea-8f8b-4381-83c6-79fa7120f1cf" --id="479e3145-dd38-476b-932c-529ceb705947" --email="jane@example.com"',
	];
	configureCustomHelp(updateCommand, fields, updateExamples);

	contactsCommand.addCommand(updateCommand);
}
