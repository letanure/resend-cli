import type { CliField } from '@/types/index.js';

// Input fields (for CLI and TUI form)
export const fields: Array<CliField> = [
	{
		name: 'audience_id',
		label: 'Audience ID',
		placeholder: 'Enter audience ID (e.g., 78261eea-8f8b-4381-83c6-79fa7120f1cf)',
		helpText: 'The unique identifier of the audience to list contacts from',
		cliFlag: 'audience-id',
		cliShortFlag: 'a',
	},
];

// Display fields (for table columns)
export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'Contact ID',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'email',
		label: 'Email',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'first_name',
		label: 'First Name',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'last_name',
		label: 'Last Name',
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
	{
		name: 'subscribed',
		label: 'Subscribed',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
];
