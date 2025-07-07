import type { FormField } from '@/types/index.js';

export interface FormattedField {
	label: string;
	value: string;
}

/**
 * Generic function to format data using field configuration
 * Returns array of formatted fields that can be displayed by CLI or TUI
 */
export function formatDataWithFields(
	data: Record<string, unknown>,
	fields: Array<FormField>,
	fieldsToShow?: Array<string>,
): Array<FormattedField> {
	const fieldsToDisplay = fieldsToShow || Object.keys(data);
	const formattedFields: Array<FormattedField> = [];

	for (const fieldName of fieldsToDisplay) {
		const field = fields.find((f) => f.name === fieldName);
		const value = data[fieldName];

		if (value === undefined || value === null || value === '') {
			continue;
		}

		// Use field label or fallback to field name
		const label = field?.label || fieldName;

		// Format the value based on type and content
		let displayValue: string;

		if (Array.isArray(value)) {
			if (value.length === 0) {
				continue;
			}
			displayValue = value.join(', ');
		} else if (typeof value === 'string') {
			// Handle date strings
			if (fieldName === 'created_at') {
				displayValue = new Date(value).toLocaleString();
			} else if (field?.type === 'textarea' && value.length > 100) {
				// Truncate long content
				displayValue = `${value.substring(0, 100)}...`;
			} else {
				displayValue = value;
			}
		} else if (value instanceof Date) {
			displayValue = value.toLocaleString();
		} else if (typeof value === 'object') {
			displayValue = JSON.stringify(value);
		} else {
			displayValue = String(value);
		}

		formattedFields.push({ label, value: displayValue });
	}

	return formattedFields;
}

/**
 * Format fields for CLI display with consistent padding
 */
export function formatForCLI(formattedFields: Array<FormattedField>, title?: string): string {
	const lines: Array<string> = [];

	if (title) {
		lines.push(title);
		lines.push('');
	}

	for (const field of formattedFields) {
		lines.push(` ${field.label.padEnd(15)}: ${field.value}`);
	}

	lines.push('');
	return lines.join('\n');
}
