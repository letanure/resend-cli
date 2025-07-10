import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'broadcast-id',
		label: 'Broadcast ID',
		placeholder: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		helpText: 'The broadcast ID to retrieve',
		cliFlag: '--broadcast-id',
		cliShortFlag: '-b',
	},
];

export const retrieveBroadcastFields: Array<FormField> = [
	{
		name: 'broadcastId',
		label: 'Broadcast ID',
		type: 'input-with-selector',
		placeholder: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		helpText: 'Enter the broadcast ID or select from list',
	},
];

// Display fields for the retrieve result
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
		name: 'name',
		label: 'Name',
		placeholder: '',
		helpText: '',
		cliFlag: '--name',
		cliShortFlag: '-n',
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
		name: 'from',
		label: 'From',
		placeholder: '',
		helpText: '',
		cliFlag: '--from',
		cliShortFlag: '-f',
	},
	{
		name: 'subject',
		label: 'Subject',
		placeholder: '',
		helpText: '',
		cliFlag: '--subject',
		cliShortFlag: '-s',
	},
	{
		name: 'status',
		label: 'Status',
		placeholder: '',
		helpText: '',
		cliFlag: '--status',
		cliShortFlag: '-t',
	},
	{
		name: 'created_at',
		label: 'Created At',
		placeholder: '',
		helpText: '',
		cliFlag: '--created-at',
		cliShortFlag: '-c',
	},
];
