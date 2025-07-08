import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'broadcast-id',
		label: 'Broadcast ID',
		placeholder: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		helpText: 'The ID of the broadcast you want to delete',
		cliFlag: '--broadcast-id',
		cliShortFlag: '-b',
	},
];

export const deleteBroadcastFields: Array<FormField> = [
	{
		name: 'broadcastId',
		label: 'Broadcast ID',
		type: 'text',
		placeholder: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		helpText: 'Enter the broadcast ID to delete (only draft or scheduled broadcasts)',
	},
];

// Display fields for the delete result
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
	{
		name: 'deleted',
		label: 'Deleted',
		placeholder: '',
		helpText: '',
		cliFlag: '--deleted',
		cliShortFlag: '-d',
	},
];
