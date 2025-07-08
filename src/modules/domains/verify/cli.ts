import { Command } from 'commander';
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

		// Validate required data
		const data: VerifyDomainData = {
			domainId: allOptions.id as string,
		};

		// Validate the data
		const validationResult = verifyDomainSchema.safeParse(data);
		if (!validationResult.success) {
			displayResults({
				data,
				result: {
					success: false,
					error: `Validation failed: ${validationResult.error.errors.map((e) => e.message).join(', ')}`,
				},
				fields,
				outputFormat,
				apiKey,
				isDryRun,
				operation: {
					success: {
						title: 'Domain Verified',
						message: () => '',
					},
					error: {
						title: 'Validation Error',
						message: 'Invalid input data',
					},
					dryRun: {
						title: 'DRY RUN - Domain Verify',
						message: 'Validation failed',
					},
				},
			});
			return;
		}

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await verifyDomain(validationResult.data, apiKey);

		// Display results
		displayResults({
			data: validationResult.data,
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

export const domainVerifyCommand = new Command('verify')
	.description('Verify a domain by ID using Resend API')
	.option('--id <id>', 'Domain ID')
	.option('--dry-run', 'Validate input without calling API', false)
	.action(handleVerifyCommand);
