import type { CliField, FormField } from '@/types/index.js';

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
		name: 'audienceId',
		label: 'Audience ID',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'The ID of the audience to add the contact to',
		type: 'text',
		cliFlag: '--audience-id',
		cliShortFlag: '-a',
	},
	{
		name: 'firstName',
		label: 'First Name',
		placeholder: 'Steve',
		helpText: 'The first name of the contact (optional)',
		type: 'text',
		cliFlag: '--first-name',
		cliShortFlag: '-f',
	},
	{
		name: 'lastName',
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
		type: 'select',
		display: 'inline',
		options: [
			{
				value: false,
				label: 'Subscribed',
				color: 'green',
			},
			{
				value: true,
				label: 'Unsubscribed',
				color: 'red',
			},
		],
		cliFlag: '--unsubscribed',
		cliShortFlag: '-u',
	},
];

export const createContactFields: Array<FormField> = [
	{
		name: 'email',
		label: 'Email',
		type: 'text',
		placeholder: 'user@example.com',
		helpText: 'The email address of the contact',
	},
	{
		name: 'audienceId',
		label: 'Audience ID',
		type: 'input-with-selector',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'The ID of the audience to add the contact to',
	},
	{
		name: 'firstName',
		label: 'First Name',
		type: 'text',
		placeholder: 'Steve',
		helpText: 'The first name of the contact (optional)',
	},
	{
		name: 'lastName',
		label: 'Last Name',
		type: 'text',
		placeholder: 'Wozniak',
		helpText: 'The last name of the contact (optional)',
	},
	{
		name: 'unsubscribed',
		label: 'Subscription Status',
		type: 'select',
		display: 'inline',
		placeholder: 'Select status',
		helpText: 'Whether the contact is unsubscribed',
		options: [
			{
				value: 'false',
				label: 'Subscribed',
			},
			{
				value: 'true',
				label: 'Unsubscribed',
			},
		],
	},
];
