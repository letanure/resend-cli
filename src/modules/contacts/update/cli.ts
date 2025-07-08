import { Command } from 'commander';
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
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		// Convert CLI option names to schema field names
		const data: UpdateContactData = {
			audienceId: allOptions.audienceId as string,
			id: allOptions.id as string,
			email: allOptions.email as string,
			firstName: allOptions.firstName as string,
			lastName: allOptions.lastName as string,
			unsubscribed: allOptions.unsubscribed === 'true' ? true : allOptions.unsubscribed === 'false' ? false : undefined,
		};

		// Validate the data
		const validationResult = updateContactSchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await updateContact(validationResult.data, apiKey);

		displayResults({
			data: validationResult.data,
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
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

export function registerUpdateContactCommand(contactsCommand: Command): void {
	const updateCommand = new Command('update')
		.alias('u')
		.description('Update an existing contact')
		.action(handleUpdateCommand);

	// Add CLI options
	fields.forEach((field) => {
		const flags = `${field.cliShortFlag}, ${field.cliFlag} <value>`;
		updateCommand.option(flags, field.helpText, field.placeholder);
	});

	contactsCommand.addCommand(updateCommand);
}
