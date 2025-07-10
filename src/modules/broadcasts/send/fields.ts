import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'broadcast-id',
		label: 'Broadcast ID',
		placeholder: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
		helpText: 'The ID of the broadcast you want to send',
		cliFlag: '--broadcast-id',
		cliShortFlag: '-b',
	},
	{
		name: 'scheduled-at',
		label: 'Scheduled At',
		placeholder: 'in 1 min',
		helpText: 'Schedule email to be sent later (natural language or ISO 8601 format)',
		cliFlag: '--scheduled-at',
		cliShortFlag: '-s',
	},
];

export const sendBroadcastFields: Array<FormField> = [
	{
		name: 'broadcastId',
		label: 'Broadcast ID',
		type: 'input-with-selector',
		placeholder: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
		helpText: 'Enter the broadcast ID to send',
	},
	{
		name: 'scheduledAt',
		label: 'Scheduled At',
		type: 'text',
		placeholder: 'in 1 min',
		helpText: 'Schedule email to be sent later (natural language or ISO 8601 format) - optional',
	},
];

// Display fields for the send result
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
