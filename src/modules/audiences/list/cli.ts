import chalk from 'chalk';
import { Command } from 'commander';
import { registerFieldOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { formatAsTable } from '@/utils/table-formatter.js';
import { listAudiences } from './action.js';
import { displayFields, fields } from './fields.js';

// Main handler for list command
async function handleListCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	// Get global options from the root program (need to go up two levels)
	const rootProgram = command.parent?.parent;
	const globalOptions = rootProgram?.opts() || {};
	// Merge local and global options
	const allOptions = { ...globalOptions, ...options };

	try {
		// Extract output format
		const outputFormat = (allOptions.output as OutputFormat) || 'text';

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

		// Get API key only if not in dry run mode
		const apiKey = isDryRun ? 'dummy' : getResendApiKey();

		if (isDryRun) {
			const mockData = [
				{
					id: 'dry-run-audience-1',
					name: 'Sample Audience 1',
					created_at: '2023-10-06T22:59:55.977Z',
				},
				{
					id: 'dry-run-audience-2',
					name: 'Sample Audience 2',
					created_at: '2023-10-07T10:30:12.123Z',
				},
			];

			if (outputFormat === 'json') {
				console.log(
					JSON.stringify(
						{
							success: true,
							data: {
								object: 'list',
								data: mockData,
							},
						},
						null,
						2,
					),
				);
			} else {
				console.log('DRY RUN - Sample audience list data (not from API)\n');
				console.log(formatAsTable(mockData, displayFields));
				console.log('\nValidation successful! (Audiences not fetched due to --dry-run flag)');
			}
			return;
		}

		const result = await listAudiences({}, apiKey);

		if (result.success && result.data) {
			const audiences = result.data.data || [];

			if (outputFormat === 'json') {
				console.log(JSON.stringify(result, null, 2));
			} else {
				console.log(chalk.green('✓ Audience Search Completed'));

				// Convert audience objects to Record<string, unknown> for table formatter
				const tableData = audiences.map((audience) => ({
					id: audience.id,
					name: audience.name,
					created_at: audience.created_at,
				}));

				const tableOutput = formatAsTable(tableData, displayFields);
				console.log(tableOutput);

				// Add count message
				if (audiences.length === 0) {
					console.log(chalk.yellow('No audiences found (0 results). Create your first audience to get started.'));
				} else {
					console.log(chalk.yellow(`Found ${audiences.length} audience${audiences.length === 1 ? '' : 's'}`));
				}
			}
		} else {
			const errorOutput = {
				success: false,
				error: result.error || 'Unknown error occurred',
			};

			if (outputFormat === 'json') {
				console.log(JSON.stringify(errorOutput, null, 2));
			} else {
				console.error(chalk.red('✗ Failed to List Audiences'));
				console.error(chalk.red(result.error || 'Unknown error occurred'));
			}
			process.exit(1);
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

		if ((allOptions.output as OutputFormat) === 'json') {
			console.log(
				JSON.stringify(
					{
						success: false,
						error: errorMessage,
					},
					null,
					2,
				),
			);
		} else {
			console.error(chalk.red('✗ Unexpected error:'), chalk.red(errorMessage));
		}
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
