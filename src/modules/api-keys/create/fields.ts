import type { CliField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'name',
		label: 'API Key Name',
		placeholder: 'Enter API key name (e.g., Production)',
		helpText: 'A descriptive name for your API key',
		cliFlag: 'name',
		cliShortFlag: 'n',
	},
	{
		name: 'permission',
		label: 'Permission',
		placeholder: '',
		helpText: 'Select the permission level for this API key',
		type: 'select',
		display: 'inline',
		options: [
			{
				value: 'full_access',
				label: 'Full Access',
				color: 'red',
			},
			{
				value: 'sending_access',
				label: 'Sending Access',
				color: 'green',
			},
		],
		cliFlag: 'permission',
		cliShortFlag: 'p',
	},
	{
		name: 'domain_id',
		label: 'Domain ID',
		placeholder: 'Enter domain ID (e.g., d91cd9bd-1176-453e-8fc1-35364d380206)',
		helpText: 'Restrict API key to send emails only from this domain (only for sending_access)',
		cliFlag: 'domain-id',
		cliShortFlag: 'd',
	},
];

export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'API Key ID',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'token',
		label: 'Token',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
];
