import type { CliField } from '@/types/index.js';

// Input fields (for CLI)
export const fields: Array<CliField> = [
	{
		name: 'id',
		label: 'Audience ID',
		placeholder: 'Enter audience ID (e.g., 78261eea-8f8b-4381-83c6-79fa7120f1cf)',
		helpText: 'The unique identifier of the audience to delete',
		cliFlag: 'id',
		cliShortFlag: 'i',
	},
];

// Display fields (for results)
export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'Audience ID',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'object',
		label: 'Object Type',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'deleted',
		label: 'Deleted',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
];
