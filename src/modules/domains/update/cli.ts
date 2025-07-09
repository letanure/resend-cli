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
		const validatedData = validateOptions<UpdateDomainData>(
			processedOptions,
			// biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for complex union type
			updateDomainSchema as any,
			outputFormat,
			fields,
			command,
		);

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
		displayResults({
			data: {},
			result: { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
			fields,
			outputFormat: (allOptions.output as OutputFormat) || 'text',
			apiKey: '',
			isDryRun: false,
			operation: {
				success: { title: '', message: () => '' },
				error: { title: 'Unexpected Error', message: 'An unexpected error occurred' },
				dryRun: { title: 'DRY RUN Failed', message: 'Dry run failed' },
			},
		});
	}
}

export const domainUpdateCommand = new Command('update')
	.description('Update a domain configuration using Resend API')
	.action(handleUpdateCommand);

// Add CLI options
registerFieldOptions(domainUpdateCommand, fields);

const updateExamples = [
	'$ resend-cli domain update --id="example.com" --click-tracking yes',
	'$ resend-cli domain update --id="example.com" --open-tracking no --tls enforced',
	'$ resend-cli domain update --id="example.com" --click-tracking yes --output json',
	'$ resend-cli domain update --id="example.com" --tls opportunistic --dry-run',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli domain update --id="example.com" --click-tracking yes',
];

configureCustomHelp(domainUpdateCommand, fields, updateExamples);
