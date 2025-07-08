import { Command } from 'commander';
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

		// Validate required data
		const data: CreateDomainData = {
			name: allOptions.name as string,
			region: allOptions.region as CreateDomainData['region'],
			custom_return_path: allOptions.customReturnPath as string,
		};

		// Validate the data
		const validationResult = createDomainSchema.safeParse(data);
		if (!validationResult.success) {
			console.error('Validation failed:', validationResult.error.issues.map((issue) => issue.message).join(', '));
			process.exit(1);
		}

		const result = isDryRun ? undefined : await createDomain(validationResult.data, apiKey);

		displayResults({
			data: validationResult.data,
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

	// Add field-based options
	for (const field of fields) {
		if (field.cliFlag) {
			const optionFlag = field.cliShortFlag ? `${field.cliShortFlag}, ${field.cliFlag}` : field.cliFlag;
			let flagWithValue = `${optionFlag} <value>`;

			// For select fields, add the options to the help text
			if (field.type === 'select' && field.options) {
				const optionsText = field.options.map((opt) => opt.value).join('|');
				flagWithValue = `${optionFlag} <${optionsText}>`;
			}

			createCommand.option(flagWithValue, field.helpText);
		}
	}

	const createExamples = [
		'$ resend-cli domains create --name "example.com"',
		'$ resend-cli domains create -n "example.com" --region "eu-west-1"',
		'$ resend-cli domains create --name "example.com" --custom-return-path "mail" --output json',
		'$ resend-cli domains create --name "example.com" --dry-run',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli domains create -n "example.com"',
	];

	createCommand.addHelpText('after', `\nExamples:\n${createExamples.map((example) => `  ${example}`).join('\n')}`);

	return createCommand;
}
