import type { CliField } from '@/types/index.js';

// No input fields needed for domains list (no parameters required)
export const fields: Array<CliField> = [];

// Display fields for the domains list table
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
];
