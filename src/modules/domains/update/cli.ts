import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { updateDomain } from './action.js';
import { fields } from './fields.js';
import { type UpdateDomainData, updateDomainSchema } from './schema.js';

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

		// Convert string boolean values to actual booleans for validation
		const processedOptions = { ...allOptions };
		if (typeof processedOptions.clickTracking === 'string') {
			processedOptions.clickTracking = ['yes', 'true', '1'].includes(processedOptions.clickTracking.toLowerCase());
		}
		if (typeof processedOptions.openTracking === 'string') {
			processedOptions.openTracking = ['yes', 'true', '1'].includes(processedOptions.openTracking.toLowerCase());
		}

		// Validate the data using unified validation
		const validatedData = validateOptions(
			processedOptions,
			updateDomainSchema,
			outputFormat,
			fields,
			command,
		) as UpdateDomainData;

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await updateDomain(validatedData, apiKey);

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
					title: 'Domain Updated',
					message: () => 'Domain configuration updated successfully',
				},
				error: {
					title: 'Failed to Update Domain',
					message: 'Failed to update domain configuration',
				},
				dryRun: {
					title: 'DRY RUN - Domain Update',
					message: 'Validation successful! (Domain not updated due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		displayResults({
			data: {},
			result: { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
			fields,
			outputFormat,
			apiKey: '',
			isDryRun: false,
			operation: {
				success: {
					title: 'Domain Updated',
					message: () => '',
				},
				error: {
					title: 'Unexpected Error',
					message: 'An unexpected error occurred',
				},
				dryRun: {
					title: 'DRY RUN - Domain Update',
					message: 'Dry run failed',
				},
			},
		});
	}
}

export function createUpdateDomainCommand(): Command {
	const updateCommand = new Command('update')
		.description('Update a domain configuration using Resend API')
		.action(handleUpdateCommand);

	registerFieldOptions(updateCommand, fields);

	const updateExamples = [
		'$ resend-cli domains update --id "example.com" --click-tracking yes',
		'$ resend-cli domains update --id "example.com" --open-tracking no --tls enforced',
		'$ resend-cli domains update --id "example.com" --click-tracking yes --output json',
		'$ resend-cli domains update --id "example.com" --tls opportunistic --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli domains update --id "example.com" --click-tracking yes',
	];

	configureCustomHelp(updateCommand, fields, updateExamples);

	return updateCommand;
}

export const domainUpdateCommand = createUpdateDomainCommand();
