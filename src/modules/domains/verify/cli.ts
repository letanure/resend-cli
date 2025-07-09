import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { verifyDomain } from './action.js';
import { fields } from './fields.js';
import { type VerifyDomainData, verifyDomainSchema } from './schema.js';

async function handleVerifyCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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
		const validatedData = validateOptions<VerifyDomainData>(
			allOptions,
			verifyDomainSchema,
			outputFormat,
			fields,
			command,
		);

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await verifyDomain(validatedData, apiKey);

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
					title: 'Domain Verified',
					message: () => 'Domain verification completed successfully',
				},
				error: {
					title: 'Failed to Verify Domain',
					message: 'Failed to verify domain with Resend',
				},
				dryRun: {
					title: 'DRY RUN - Domain Verify',
					message: 'Validation successful! (Domain not verified due to --dry-run flag)',
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

export const domainVerifyCommand = new Command('verify')
	.description('Verify a domain by ID using Resend API')
	.action(handleVerifyCommand);

// Add CLI options
registerFieldOptions(domainVerifyCommand, fields);

const verifyExamples = [
	'$ resend-cli domain verify --id="example.com"',
	'$ resend-cli domain verify --id="example.com" --output json',
	'$ resend-cli domain verify --id="example.com" --dry-run',
	'$ RESEND_API_KEY="re_xxxxx" resend-cli domain verify --id="example.com"',
	'$ resend-cli domain verify --id="example.com" | jq \'.\'',
];

configureCustomHelp(domainVerifyCommand, fields, verifyExamples);
