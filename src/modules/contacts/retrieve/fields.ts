import type { CliField } from '@/types/index.js';

// Input fields (for CLI)
export const fields: Array<CliField> = [
	{
		name: 'audienceId',
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
		helpText: 'The unique identifier of the contact to retrieve',
		cliFlag: 'id',
		cliShortFlag: 'i',
	},
	{
		name: 'email',
		label: 'Email',
		placeholder: 'user@example.com',
		helpText: 'The email address of the contact to retrieve',
		cliFlag: 'email',
		cliShortFlag: 'e',
	},
];

// Display fields (for results)
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
		name: 'object',
		label: 'Object Type',
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
		name: 'firstName',
		label: 'First Name',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
	{
		name: 'lastName',
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
		name: 'unsubscribed',
		label: 'Subscription Status',
		placeholder: '',
		helpText: '',
		cliFlag: '',
		cliShortFlag: '',
	},
];
