import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { createDomain } from './action.js';
import { fields } from './fields.js';
import { type CreateDomainData, createDomainSchema } from './schema.js';

async function handleCreateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
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
			createDomainSchema,
			outputFormat,
			fields,
			command,
		) as CreateDomainData;

		const result = isDryRun ? undefined : await createDomain(validatedData, apiKey);

		displayResults({
			data: validatedData,
			result,
			fields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'Domain Created Successfully',
					message: (data: unknown) => {
						const domainData = data as CreateDomainData;
						return `Domain ${domainData.name} has been created successfully`;
					},
				},
				error: {
					title: 'Failed to Create Domain',
					message: 'Domain creation failed',
				},
				dryRun: {
					title: 'DRY RUN - Domain Create (validation only)',
					message: 'Validation successful! (Domain not created due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerCreateDomainCommand(domainsCommand: Command): void {
	const createCommand = createCreateDomainCommand();
	domainsCommand.addCommand(createCommand);
}

function createCreateDomainCommand(): Command {
	const createCommand = new Command('create')
		.description('Create a domain through the Resend Email API')
		.action(handleCreateCommand);

	registerFieldOptions(createCommand, fields);

	const createExamples = [
		'$ resend-cli domains create --name "example.com"',
		'$ resend-cli domains create -n "example.com" --region "eu-west-1"',
		'$ resend-cli domains create --name "example.com" --custom-return-path "mail" --output json',
		'$ resend-cli domains create --name "example.com" --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli domains create -n "example.com"',
	];

	configureCustomHelp(createCommand, fields, createExamples);

	return createCommand;
}
