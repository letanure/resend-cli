import type { CliField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'email',
		label: 'Email',
		placeholder: 'user@example.com',
		helpText: 'The email address of the contact',
		type: 'text',
		cliFlag: '--email',
		cliShortFlag: '-e',
	},
	{
		name: 'audience_id',
		label: 'Audience ID',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'The ID of the audience to add the contact to',
		type: 'text',
		cliFlag: '--audience-id',
		cliShortFlag: '-a',
	},
	{
		name: 'first_name',
		label: 'First Name',
		placeholder: 'Steve',
		helpText: 'The first name of the contact (optional)',
		type: 'text',
		cliFlag: '--first-name',
		cliShortFlag: '-f',
	},
	{
		name: 'last_name',
		label: 'Last Name',
		placeholder: 'Wozniak',
		helpText: 'The last name of the contact (optional)',
		type: 'text',
		cliFlag: '--last-name',
		cliShortFlag: '-l',
	},
	{
		name: 'unsubscribed',
		label: 'Subscription Status',
		placeholder: 'false',
		helpText: 'Whether the contact is unsubscribed (true/false)',
		type: 'radio',
		options: [
			{
				value: false,
				label: 'Subscribed',
				color: 'green',
				icon: '✓',
			},
			{
				value: true,
				label: 'Unsubscribed',
				color: 'red',
				icon: '✗',
			},
		],
		cliFlag: '--unsubscribed',
		cliShortFlag: '-u',
	},
];
