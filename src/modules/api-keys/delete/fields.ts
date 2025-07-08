import type { CliField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'api_key_id',
		label: 'API Key ID',
		placeholder: 'Enter the API key ID to delete',
		helpText: 'The unique identifier of the API key to remove',
		cliFlag: '--api-key-id',
		cliShortFlag: '-i',
	},
];
