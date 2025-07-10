import type { CliField, FormField } from '@/types/index.js';
import { filterFieldsForCli } from '@/utils/fields.js';

export const audienceFields: Array<FormField> = [
	{
		name: 'name',
		label: 'Audience Name',
		placeholder: 'Registered Users',
		helpText: 'The name of the audience you want to create',
		cliFlag: 'name',
		cliShortFlag: 'n',
	},
];

const createFieldNames = ['name'];

export const fields: Array<CliField> = filterFieldsForCli(createFieldNames, audienceFields);
