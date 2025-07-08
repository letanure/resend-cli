import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'id',
		label: 'Domain ID',
		placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
		helpText: 'The ID of the domain to retrieve',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
];

export const retrieveDomainFields: Array<FormField> = [
	{
		name: 'domainId',
		label: 'Domain ID',
		type: 'text',
		placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
		helpText: 'Enter the domain ID to retrieve',
	},
];

// Display fields for the domain result
export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'ID',
		placeholder: '',
		helpText: '',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
	{
		name: 'name',
		label: 'Domain',
		placeholder: '',
		helpText: '',
		cliFlag: '--name',
		cliShortFlag: '-n',
	},
	{
		name: 'status',
		label: 'Status',
		placeholder: '',
		helpText: '',
		cliFlag: '--status',
		cliShortFlag: '-s',
	},
	{
		name: 'region',
		label: 'Region',
		placeholder: '',
		helpText: '',
		cliFlag: '--region',
		cliShortFlag: '-r',
	},
	{
		name: 'created_at',
		label: 'Created',
		placeholder: '',
		helpText: '',
		cliFlag: '--created-at',
		cliShortFlag: '-c',
	},
	{
		name: 'records',
		label: 'DNS Records',
		placeholder: '',
		helpText: '',
		cliFlag: '--records',
		cliShortFlag: '-d',
	},
];
