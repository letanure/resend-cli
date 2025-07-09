import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'domainId',
		label: 'Domain ID',
		placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
		helpText: 'The ID of the domain to delete',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
];

export const deleteDomainFields: Array<FormField> = [
	{
		name: 'domainId',
		label: 'Domain ID',
		type: 'text',
		placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
		helpText: 'Enter the domain ID to delete',
	},
];

// Display fields for the delete result
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
		name: 'object',
		label: 'Object',
		placeholder: '',
		helpText: '',
		cliFlag: '--object',
		cliShortFlag: '-o',
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
