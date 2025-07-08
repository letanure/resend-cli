import type { FormField } from '@/types/index.js';

// Common email fields that can be reused across send, retrieve, batch operations
export const commonEmailFields: Array<FormField> = [
	{
		name: 'id',
		label: 'Email ID',
		placeholder: '402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f',
		helpText: 'The unique identifier of the email',
		cliFlag: 'id',
		cliShortFlag: 'i',
	},
	{
		name: 'from',
		label: 'From',
		placeholder: 'Your Name <sender@domain.com>',
		helpText: 'Sender email address with optional name',
		cliFlag: 'from',
		cliShortFlag: 'f',
	},
	{
		name: 'to',
		label: 'To',
		placeholder: 'recipient@domain.com',
		helpText: 'Recipient email(s) - comma separated for multiple (max 50)',
		cliFlag: 'to',
		cliShortFlag: 't',
	},
	{
		name: 'subject',
		label: 'Subject',
		placeholder: 'Enter email subject',
		helpText: 'Email subject line',
		cliFlag: 'subject',
		cliShortFlag: 's',
	},
	{
		name: 'bcc',
		label: 'BCC',
		placeholder: 'bcc@domain.com',
		helpText: 'Blind carbon copy recipients - comma separated',
		cliFlag: 'bcc',
		cliShortFlag: 'b',
	},
	{
		name: 'cc',
		label: 'CC',
		placeholder: 'cc@domain.com',
		helpText: 'Carbon copy recipients - comma separated for multiple',
		cliFlag: 'cc',
		cliShortFlag: 'c',
	},
	{
		name: 'scheduledAt',
		label: 'Schedule',
		placeholder: 'in 1 hour OR 2024-08-05T11:52:01.858Z',
		helpText: 'Natural language (in 1 min) or ISO 8601 format',
		cliFlag: 'scheduled-at',
		cliShortFlag: 'a',
	},
	{
		name: 'replyTo',
		label: 'Reply To',
		placeholder: 'reply@domain.com',
		helpText: 'Reply-to address(es) - comma separated',
		cliFlag: 'reply-to',
		cliShortFlag: 'r',
	},
	{
		name: 'html',
		label: 'HTML Content',
		placeholder: '<p>Your HTML content here</p>',
		helpText: 'HTML version of the message',
		type: 'textarea',
		cliFlag: 'html',
		cliShortFlag: 'h',
	},
	{
		name: 'text',
		label: 'Text Content',
		placeholder: 'Your plain text message here...',
		helpText: 'Plain text version',
		type: 'textarea',
		cliFlag: 'text',
		cliShortFlag: 'x',
	},
	{
		name: 'created_at',
		label: 'Created',
		placeholder: '2023-04-03T22:13:42.674981+00:00',
		helpText: 'When the email was created',
	},
	{
		name: 'last_event',
		label: 'Status',
		placeholder: 'delivered',
		helpText: 'Current status of the email',
	},
];

// Field groups for different display needs
export const EMAIL_BASIC_FIELDS = ['id', 'from', 'to', 'subject', 'last_event', 'created_at'];

export const EMAIL_CONTENT_FIELDS = ['text', 'html'];

export const EMAIL_METADATA_FIELDS = ['cc', 'bcc', 'replyTo', 'scheduledAt'];

export const EMAIL_DETAIL_FIELDS = [...EMAIL_BASIC_FIELDS, ...EMAIL_CONTENT_FIELDS];

export const EMAIL_FULL_FIELDS = [...EMAIL_BASIC_FIELDS, ...EMAIL_METADATA_FIELDS, ...EMAIL_CONTENT_FIELDS];
