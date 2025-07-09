import { Command } from 'commander';
import { registerFieldOptions, validateOptions } from '@/utils/cli.js';
import { configureCustomHelp } from '@/utils/cli-help.js';
import { displayResults } from '@/utils/display-results.js';
import type { OutputFormat } from '@/utils/output.js';
import { getResendApiKey } from '@/utils/resend-api.js';
import { createApiKey } from './action.js';
import { displayFields, fields } from './fields.js';
import { CreateApiKeyOptionsSchema, type CreateApiKeyOptionsType } from './schema.js';

async function handleCreateCommand(options: Record<string, unknown>, command: Command): Promise<void> {
	try {
		const apiKey = getResendApiKey();

		const outputFormat = (options.output as OutputFormat) || 'text';
		const validatedData = validateOptions<CreateApiKeyOptionsType>(
			options,
			CreateApiKeyOptionsSchema,
			outputFormat,
			fields,
			command,
		);

		// Business logic: If permission is full_access, clear domain_id
		const createData =
			validatedData.permission === 'full_access' ? { ...validatedData, domain_id: undefined } : validatedData;

		const isDryRun = Boolean(options.dryRun);

		const result = isDryRun ? undefined : await createApiKey(createData, apiKey);

		displayResults({
			data: createData,
			result,
			fields: displayFields,
			outputFormat,
			apiKey,
			isDryRun,
			operation: {
				success: {
					title: 'API Key Created Successfully',
					message: () => '',
				},
				error: {
					title: 'Failed to Create API Key',
					message: 'API key creation failed',
				},
				dryRun: {
					title: 'DRY RUN - API Key Creation (validation only)',
					message: 'Validation successful! (API key not created due to --dry-run flag)',
				},
			},
		});
	} catch (error) {
		console.error('Unexpected error:', error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

export function registerCreateApiKeyCommand(apiKeysCommand: Command): void {
	const createCommand = createCreateApiKeyCommand();
	apiKeysCommand.addCommand(createCommand);
}

function createCreateApiKeyCommand(): Command {
	const createCommand = new Command('create')
		.description('Create a new API key in Resend')
		.action((options: Record<string, unknown>, command: Command) => handleCreateCommand(options, command));

	registerFieldOptions(createCommand, fields);

	const createExamples = [
		'$ resend-cli api-keys create --name "Production" --permission full_access',
		'$ resend-cli api-keys create -n "Development" -p sending_access',
		'$ resend-cli api-keys create --name "Domain Specific" --permission sending_access --domain-id "d91cd9bd-1176-453e-8fc1-35364d380206"',
		'$ resend-cli api-keys create --name "Test Key" --permission full_access --output json | jq \'.\'',
		'$ resend-cli api-keys create --dry-run --name "Test" --permission sending_access',
		'$ RESEND_API_KEY="re_xxxxx" resend-cli api-keys create --name "Production" --permission full_access',
	];
	configureCustomHelp(createCommand, fields, createExamples);

	return createCommand;
}
