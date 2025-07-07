import type { CliField } from '@/types/index.js';

// Input fields (for CLI)
export const fields: Array<CliField> = [
	{
		name: 'audience_id',
		label: 'Audience ID',
		placeholder: 'Enter audience ID (e.g., 78261eea-8f8b-4381-83c6-79fa7120f1cf)',
		helpText: 'The unique identifier of the audience containing the contact',
		cliFlag: 'audience-id',
		cliShortFlag: 'a',
	},
	{
		name: 'id',
		label: 'Contact ID',
		placeholder: 'Enter contact ID (e.g., 479e3145-dd38-476b-932c-529ceb705947)',
		helpText: 'The unique identifier of the contact to delete',
		cliFlag: 'id',
		cliShortFlag: 'i',
	},
	{
		name: 'email',
		label: 'Contact Email',
		placeholder: 'Enter contact email (e.g., contact@example.com)',
		helpText: 'The email address of the contact to delete',
		cliFlag: 'email',
		cliShortFlag: 'e',
	},
];

// Display fields (for results)
export const displayFields: Array<CliField> = [
	{
		name: 'contact',
		label: 'Contact',
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
