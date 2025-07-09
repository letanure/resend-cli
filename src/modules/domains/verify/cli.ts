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
		const validatedData = validateOptions(
			allOptions,
			verifyDomainSchema,
			outputFormat,
			fields,
			command,
		) as VerifyDomainData;

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
					title: 'Domain Verified',
					message: () => '',
				},
				error: {
					title: 'Unexpected Error',
					message: 'An unexpected error occurred',
				},
				dryRun: {
					title: 'DRY RUN - Domain Verify',
					message: 'Dry run failed',
				},
			},
		});
	}
}

export function createVerifyDomainCommand(): Command {
	const verifyCommand = new Command('verify')
		.description('Verify a domain by ID using Resend API')
		.action(handleVerifyCommand);

	registerFieldOptions(verifyCommand, fields);

	const verifyExamples = [
		'$ resend-cli domains verify --id "example.com"',
		'$ resend-cli domains verify --id "example.com" --output json',
		'$ resend-cli domains verify --id "example.com" --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli domains verify --id "example.com"',
	];

	configureCustomHelp(verifyCommand, fields, verifyExamples);

	return verifyCommand;
}

export const domainVerifyCommand = createVerifyDomainCommand();
