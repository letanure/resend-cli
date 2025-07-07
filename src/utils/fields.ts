import type { CliField, FormField } from '@/types/index.js';

/**
 * Helper function to convert FormField to CliField
 * Ensures required CLI properties are present
 */
export function toCliField(field: FormField): CliField {
	if (!field.cliFlag || !field.cliShortFlag) {
		throw new Error(`Field ${field.name} missing CLI flag information`);
	}

	return {
		...field,
		placeholder: field.placeholder || '',
		helpText: field.helpText || '',
		cliFlag: field.cliFlag,
		cliShortFlag: field.cliShortFlag,
	};
}

/**
 * Helper function to get field by name from an array of fields
 */
export function getFieldByName(name: string, fields: Array<FormField>): FormField | undefined {
	return fields.find((field) => field.name === name);
}

/**
 * Helper function to convert FormField to CliField for display-only fields
 * Adds dummy CLI info for fields that are only used for display
 */
export function toDisplayField(field: FormField): CliField {
	return {
		...field,
		placeholder: field.placeholder || '',
		helpText: field.helpText || '',
		cliFlag: field.cliFlag || field.name,
		cliShortFlag: field.cliShortFlag || field.name.charAt(0),
	};
}

/**
 * Helper function to filter fields by field names and convert to CLI fields
 */
export function filterFieldsForCli(fieldNames: Array<string>, fields: Array<FormField>): Array<CliField> {
	return fieldNames
		.map((name) => getFieldByName(name, fields))
		.filter((field): field is FormField => field !== undefined)
		.map((field) => toCliField(field));
}

/**
 * Helper function to filter fields for display (allows fields without CLI info)
 */
export function filterFieldsForDisplay(fieldNames: Array<string>, fields: Array<FormField>): Array<CliField> {
	return fieldNames
		.map((name) => getFieldByName(name, fields))
		.filter((field): field is FormField => field !== undefined)
		.map((field) => toDisplayField(field));
}
