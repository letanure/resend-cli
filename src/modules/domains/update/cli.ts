import { Command } from 'commander';
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

		// Validate required data - convert CLI flags to schema format
		const data: UpdateDomainData = {
			domainId: allOptions.id as string,
			clickTracking: allOptions.clickTracking
				? ['yes', 'true', '1'].includes(String(allOptions.clickTracking).toLowerCase())
				: undefined,
			openTracking: allOptions.openTracking
				? ['yes', 'true', '1'].includes(String(allOptions.openTracking).toLowerCase())
				: undefined,
			tls: allOptions.tls as 'opportunistic' | 'enforced' | undefined,
		};

		// Validate the data
		const validationResult = updateDomainSchema.safeParse(data);
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
						title: 'Domain Updated',
						message: () => '',
					},
					error: {
						title: 'Validation Error',
						message: 'Invalid input data',
					},
					dryRun: {
						title: 'DRY RUN - Domain Update',
						message: 'Validation failed',
					},
				},
			});
			return;
		}

		// Execute action or simulate dry-run
		const result = isDryRun ? undefined : await updateDomain(validationResult.data, apiKey);

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

export const domainUpdateCommand = new Command('update')
	.description('Update a domain configuration using Resend API')
	.option('--id <id>', 'Domain ID')
	.option('--click-tracking <boolean>', 'Enable/disable click tracking (yes/no)')
	.option('--open-tracking <boolean>', 'Enable/disable open tracking (yes/no)')
	.option('--tls <mode>', 'TLS configuration (opportunistic/enforced)')
	.option('--dry-run', 'Validate input without calling API', false)
	.action(handleUpdateCommand);
