import type { CliField, FormField } from '@/types/index.js';
import { filterFieldsForCli } from '@/utils/fields.js';

// Define audience-specific fields
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

// Fields used for create audience command (only name needed)
const createFieldNames = ['name'];

export const fields: Array<CliField> = filterFieldsForCli(createFieldNames, audienceFields);
