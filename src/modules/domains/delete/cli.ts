import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { deleteDomain } from './action.js';
import { fields } from './fields.js';
import { type DeleteDomainData, deleteDomainSchema } from './schema.js';

async function handleDeleteCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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
		const validatedData = validateOptions<DeleteDomainData>(
			allOptions,
			deleteDomainSchema,
			outputFormat,
			fields,
			command,
		);

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await deleteDomain(validatedData, apiKey);

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
					title: 'Domain Deleted',
					message: () => 'Domain has been permanently deleted',
				},
				error: {
					title: 'Failed to Delete Domain',
					message: 'Failed to delete domain from Resend',
				},
				dryRun: {
					title: 'DRY RUN - Domain Delete',
					message: 'Validation successful! (Domain not deleted due to --dry-run flag)',
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

export const domainDeleteCommand = new Command('delete')
	.description('Delete a domain by ID using Resend API')
	.action(handleDeleteCommand);

// Add CLI options
registerFieldOptions(domainDeleteCommand, fields);

const deleteExamples = [
	'$ resend-cli domain delete --id="example.com"',
	'$ resend-cli domain delete --id="example.com" --dry-run',
	'$ resend-cli domain delete --output json --id="example.com" | jq \'.\'',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli domain delete --id="example.com"',
];

configureCustomHelp(domainDeleteCommand, fields, deleteExamples);
