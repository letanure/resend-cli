import { Command } from 'commander';
import { registerFieldOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { listAudiences } from './action.js';
import { displayFields, fields } from './fields.js';

async function handleListCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	const allOptions = { ...globalOptions, ...options };

	try {
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const isDryRun = Boolean(allOptions.dryRun);

		// Only get API key if not in dry-run mode
		const apiKey = isDryRun ? '' : getResendApiKey();

		const result = isDryRun ? undefined : await listAudiences({}, apiKey);

		displayResults({
			data: {},
			result,
			fields: displayFields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Audiences Retrieved Successfully',
					message: (data: unknown) => {
						// Handle the API response structure - data should have a 'data' property with the array
						const responseData = data as { data?: Array<unknown> };
						const audiences = responseData.data || [];

						if (Array.isArray(audiences) && audiences.length === 0) {
							return 'No audiences found (0 results). Create your first audience to get started.';
						}
						const count = Array.isArray(audiences) ? audiences.length : 0;
						return `Found ${count} audience${count === 1 ? '' : 's'}`;
					},
				},
				error: {
					title: 'Failed to Retrieve Audiences',
					message: 'Audiences retrieval failed',
				},
				dryRun: {
					title: 'DRY RUN - Audiences List (validation only)',
					message: 'Validation successful! (Audiences not retrieved due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function createListAudienceCommand(): Command {
	// Register the list subcommand
	const listCommand = new Command('list').description('List all audiences from Resend API').action(handleListCommand);

	// Register field options (includes --output and --dry-run options)
	registerFieldOptions(listCommand, fields);

	const listExamples = [
		'$ resend-cli audiences list',
		"$ resend-cli audiences list --output json | jq '.'",
		'$ resend-cli audiences list --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli audiences list',
	];
	configureCustomHelp(listCommand, fields, listExamples);

	return listCommand;
}
