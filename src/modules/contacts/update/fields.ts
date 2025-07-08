import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'audience-id',
		label: 'Audience ID',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'The ID of the audience containing the contact',
		cliFlag: '--audience-id',
		cliShortFlag: '-a',
	},
	{
		name: 'id',
		label: 'Contact ID',
		placeholder: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		helpText: 'The ID of the contact to update (required if email not provided)',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
	{
		name: 'email',
		label: 'Email',
		placeholder: 'contact@example.com',
		helpText: 'The email of the contact to update (required if ID not provided)',
		cliFlag: '--email',
		cliShortFlag: '-e',
	},
	{
		name: 'first-name',
		label: 'First Name',
		placeholder: 'John',
		helpText: 'The first name of the contact',
		cliFlag: '--first-name',
		cliShortFlag: '-f',
	},
	{
		name: 'last-name',
		label: 'Last Name',
		placeholder: 'Doe',
		helpText: 'The last name of the contact',
		cliFlag: '--last-name',
		cliShortFlag: '-l',
	},
	{
		name: 'unsubscribed',
		label: 'Unsubscribed',
		placeholder: 'true',
		helpText: 'The subscription status (true/false)',
		cliFlag: '--unsubscribed',
		cliShortFlag: '-u',
	},
];

export const updateContactFields: Array<FormField> = [
	{
		name: 'audienceId',
		label: 'Audience ID',
		type: 'text',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'Enter the audience ID containing the contact',
	},
	{
		name: 'id',
		label: 'Contact ID',
		type: 'text',
		placeholder: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		helpText: 'Enter the contact ID to update (optional if email is provided)',
	},
	{
		name: 'email',
		label: 'Email',
		type: 'text',
		placeholder: 'contact@example.com',
		helpText: 'Enter the email of the contact to update (optional if ID is provided)',
	},
	{
		name: 'firstName',
		label: 'First Name',
		type: 'text',
		placeholder: 'John',
		helpText: 'Enter the first name of the contact (optional)',
	},
	{
		name: 'lastName',
		label: 'Last Name',
		type: 'text',
		placeholder: 'Doe',
		helpText: 'Enter the last name of the contact (optional)',
	},
	{
		name: 'unsubscribed',
		label: 'Unsubscribed',
		type: 'select',
		placeholder: 'false',
		helpText: 'Select the subscription status (optional)',
		options: [
			{ label: 'Subscribed', value: 'false' },
			{ label: 'Unsubscribed', value: 'true' },
		],
	},
];

// Display fields for the update result
export const displayFields: Array<CliField> = [
	{
		name: 'object',
		label: 'Object',
		placeholder: '',
		helpText: '',
		cliFlag: '--object',
		cliShortFlag: '-o',
	},
	{
		name: 'id',
		label: 'ID',
		placeholder: '',
		helpText: '',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
];
