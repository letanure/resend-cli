import type { CliField } from '@/types/index.js';

// No input fields for list (it takes no parameters)
export const fields: Array<CliField> = [];

// Display fields (for table columns)
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
		name: 'name',
		label: 'Name',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'created_at',
		label: 'Created At',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
];
