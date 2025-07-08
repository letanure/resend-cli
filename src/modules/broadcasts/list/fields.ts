import type { CliField, FormField } from '@/types/index.js';

// No input fields needed for listing broadcasts - it just lists all broadcasts
export const fields: Array<CliField> = [];

export const listBroadcastsFields: Array<FormField> = [];

// Display fields for the list results
export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'ID',
		placeholder: '',
		helpText: '',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
	{
		name: 'audienceId',
		label: 'Audience ID',
		placeholder: '',
		helpText: '',
		cliFlag: '--audience-id',
		cliShortFlag: '-a',
	},
	{
		name: 'status',
		label: 'Status',
		placeholder: '',
		helpText: '',
		cliFlag: '--status',
		cliShortFlag: '-s',
	},
	{
		name: 'created_at',
		label: 'Created At',
		placeholder: '',
		helpText: '',
		cliFlag: '--created-at',
		cliShortFlag: '-c',
	},
	{
		name: 'scheduledAt',
		label: 'Scheduled At',
		placeholder: '',
		helpText: '',
		cliFlag: '--scheduled-at',
		cliShortFlag: '-h',
	},
	{
		name: 'sent_at',
		label: 'Sent At',
		placeholder: '',
		helpText: '',
		cliFlag: '--sent-at',
		cliShortFlag: '-t',
	},
];
