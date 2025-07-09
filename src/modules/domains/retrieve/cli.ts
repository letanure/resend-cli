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
		const validatedData = validateOptions<RetrieveDomainData>(
			allOptions,
			retrieveDomainSchema,
			outputFormat,
			fields,
			command,
		);

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

export const domainRetrieveCommand = new Command('retrieve')
	.description('Retrieve a domain by ID from Resend API')
	.action(handleRetrieveCommand);

// Add CLI options
registerFieldOptions(domainRetrieveCommand, fields);

const retrieveExamples = [
	'$ resend-cli domain retrieve --id="example.com"',
	'$ resend-cli domain retrieve --id="example.com" --output json',
	'$ resend-cli domain retrieve --id="example.com" --dry-run',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli domain retrieve --id="example.com"',
	'$ resend-cli domain retrieve --id="example.com" | jq \'.\'',
];

configureCustomHelp(domainRetrieveCommand, fields, retrieveExamples);
