import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'audience-id',
		label: 'Audience ID',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'The ID of the audience you want to send to',
		cliFlag: '--audience-id',
		cliShortFlag: '-a',
	},
	{
		name: 'from',
		label: 'From',
		placeholder: 'Your Name <sender@domain.com>',
		helpText: 'Sender email address with optional name',
		cliFlag: '--from',
		cliShortFlag: '-f',
	},
	{
		name: 'subject',
		label: 'Subject',
		placeholder: 'Enter broadcast subject',
		helpText: 'Email subject line',
		cliFlag: '--subject',
		cliShortFlag: '-s',
	},
	{
		name: 'reply-to',
		label: 'Reply To',
		placeholder: 'reply@domain.com',
		helpText: 'Reply-to address(es) - comma separated',
		cliFlag: '--reply-to',
		cliShortFlag: '-r',
	},
	{
		name: 'html',
		label: 'HTML Content',
		placeholder: '<p>Your HTML content here</p>',
		helpText: 'HTML version of the message',
		cliFlag: '--html',
		cliShortFlag: '-h',
	},
	{
		name: 'text',
		label: 'Text Content',
		placeholder: 'Your plain text message here...',
		helpText: 'Plain text version',
		cliFlag: '--text',
		cliShortFlag: '-t',
	},
	{
		name: 'name',
		label: 'Broadcast Name',
		placeholder: 'My Broadcast Campaign',
		helpText: 'Friendly name for internal reference (optional)',
		cliFlag: '--name',
		cliShortFlag: '-n',
	},
];

export const createBroadcastFields: Array<FormField> = [
	{
		name: 'audienceId',
		label: 'Audience ID',
		type: 'input-with-selector',
		placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		helpText: 'Enter the audience ID to send the broadcast to',
	},
	{
		name: 'from',
		label: 'From',
		type: 'text',
		placeholder: 'Your Name <sender@domain.com>',
		helpText: 'Sender email address with optional friendly name',
	},
	{
		name: 'subject',
		label: 'Subject',
		type: 'text',
		placeholder: 'Enter broadcast subject',
		helpText: 'Email subject line',
	},
	{
		name: 'replyTo',
		label: 'Reply To',
		type: 'text',
		placeholder: 'reply@domain.com',
		helpText: 'Reply-to address(es) - comma separated for multiple',
	},
	{
		name: 'html',
		label: 'HTML Content',
		type: 'textarea',
		placeholder: '<p>Your HTML content here</p>',
		helpText: 'HTML version of the message',
	},
	{
		name: 'text',
		label: 'Text Content',
		type: 'textarea',
		placeholder: 'Your plain text message here...',
		helpText: 'Plain text version of the message',
	},
	{
		name: 'name',
		label: 'Broadcast Name',
		type: 'text',
		placeholder: 'My Broadcast Campaign',
		helpText: 'Friendly name for internal reference (optional)',
	},
];

// Display fields for the create result
export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'ID',
		placeholder: '',
		helpText: '',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
];
