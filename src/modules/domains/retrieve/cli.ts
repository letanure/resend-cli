import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { retrieveDomain } from './action.js';
import { fields } from './fields.js';
import { type RetrieveDomainData, retrieveDomainSchema } from './schema.js';

async function handleRetrieveCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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

		// Validate the data using unified validation
		const validatedData = validateOptions(
			allOptions,
			retrieveDomainSchema,
			outputFormat,
			fields,
			command,
		) as RetrieveDomainData;

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await retrieveDomain(validatedData, apiKey);

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
					title: 'Domain Retrieved',
					message: () => '',
				},
				error: {
					title: 'Failed to Retrieve Domain',
					message: 'Failed to retrieve domain from Resend',
				},
				dryRun: {
					title: 'DRY RUN - Domain Retrieve',
					message: 'Validation successful! (Domain not retrieved due to --dry-run flag)',
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
					title: 'Domain Retrieved',
					message: () => '',
				},
				error: {
					title: 'Unexpected Error',
					message: 'An unexpected error occurred',
				},
				dryRun: {
					title: 'DRY RUN - Domain Retrieve',
					message: 'Dry run failed',
				},
			},
		});
	}
}

export function createRetrieveDomainCommand(): Command {
	const retrieveCommand = new Command('retrieve')
		.description('Retrieve a domain by ID from Resend API')
		.action(handleRetrieveCommand);

	registerFieldOptions(retrieveCommand, fields);

	const retrieveExamples = [
		'$ resend-cli domains retrieve --id "example.com"',
		'$ resend-cli domains retrieve --id "example.com" --output json',
		'$ resend-cli domains retrieve --id "example.com" --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli domains retrieve --id "example.com"',
	];

	configureCustomHelp(retrieveCommand, fields, retrieveExamples);

	return retrieveCommand;
}

export const domainRetrieveCommand = createRetrieveDomainCommand();
