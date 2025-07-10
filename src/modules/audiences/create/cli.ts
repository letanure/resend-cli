import type { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { createAudience } from './action.js';
import { fields } from './fields.js';
import { CreateAudienceOptionsSchema, type CreateAudienceOptionsType } from './schema.js';

async function handleCreateAudienceCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		// Get global options from the root program (need to go up two levels)
		const rootProgram = command.parent?.parent;
		const globalOptions = rootProgram?.opts() || {};
		// Merge local and global options
		const allOptions = { ...globalOptions, ...options };

		// Extract output format and validate audience data
		const outputFormat = (allOptions.output as OutputFormat) || 'text';
		const audienceData = validateOptions<CreateAudienceOptionsType>(
			allOptions,
			CreateAudienceOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Check if dry-run mode is enabled
		const isDryRun = Boolean(allOptions.dryRun);

		// Use generic displayResults function
		const result = isDryRun ? undefined : await createAudience(audienceData, apiKey);

		displayResults({
			data: audienceData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Audience Created Successfully',
					message: () => `Audience "${audienceData.name}" has been created`,
				},
				error: {
					title: 'Failed to Create Audience',
					message: 'Audience creation failed',
				},
				dryRun: {
					title: 'DRY RUN - Audience Creation (validation only)',
					message: 'Validation successful! (Audience not created due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerCreateAudienceCommand(audienceCommand: Command): void {
	// Register the create subcommand
	const createCommand = audienceCommand
		.command('create')
		.description('Create a new audience via Resend API')
		.action(handleCreateAudienceCommand);

	// Add all the field options to the create command
	registerFieldOptions(createCommand, fields);

	const createExamples = [
		'$ resend-cli audience create --name="Registered Users"',
		'$ resend-cli audience create -n "Newsletter Subscribers"',
		'$ resend-cli audience create --output json --name="Beta Testers" | jq \'.\'',
		'$ resend-cli audience create --dry-run --name="Test Audience"',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli audience create --name="My Audience"',
	];

	configureCustomHelp(createCommand, fields, createExamples);
}
