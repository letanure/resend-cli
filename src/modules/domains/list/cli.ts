import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { listDomains } from './action.js';
import { displayFields, fields } from './fields.js';
import { ListDomainsOptionsSchema, type ListDomainsOptionsType } from './schema.js';

// Main handler for list command
async function handleListCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Get global options from the root program (need to go up two levels)
		const rootProgram = command.parent?.parent;
		const globalOptions = rootProgram?.opts() || {};
		// Merge local and global options
		const allOptions = { ...globalOptions, ...options };

		// Extract output format and validate list data
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const listData = validateOptions<ListDomainsOptionsType>(allOptions, ListDomainsOptionsSchema, outputFormat);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await listDomains(listData, apiKey);

		displayResults({
			data: {},
			result,
			fields: displayFields, // Use display fields for result formatting
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Domains Retrieved Successfully',
					message: (data: unknown) => {
						// Handle the API response structure - data should have a 'data' property with the array
						const responseData = data as { data?: Array<unknown> };
						const domains = responseData.data || [];

						if (Array.isArray(domains) && domains.length === 0) {
							return 'No domains found (0 results). Create your first domain to get started.';
						}
						const count = Array.isArray(domains) ? domains.length : 0;
						return `Found ${count} domain${count === 1 ? '' : 's'}`;
					},
				},
				error: {
					title: 'Failed to Retrieve Domains',
					message: 'Domains retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - Domains List (validation only)',
					message: 'Validation successful! (Domains not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerListDomainsCommand(domainsCommand: Command) {
	// Register the list subcommand
	const listCommand = domainsCommand
		.command('list')
		.description('List all domains from Resend API')
		.action((options: Record<string, unknown>, command: Command) => handleListCommand(options, command));

	// Add all the field options to the list command (none needed for domains list)
	registerFieldOptions(listCommand, fields);

	const listExamples = [
		'$ resend-cli domains list',
		'$ resend-cli domains list --output json',
		"$ resend-cli domains list --output json | jq '.'",
		'$ resend-cli domains list --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli domains list',
	];
	configureCustomHelp(listCommand, fields, listExamples);
}
