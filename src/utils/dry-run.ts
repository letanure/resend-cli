import type { CliField } from '@/types/index.js';

/**
 * Console output utilities for dry-run mode
 */
export function logDryRunTitle(title: string): void {
	console.log(title);
}

export function logDryRunField(field: CliField, value: unknown): void {
	if (value !== undefined && value !== null && value !== '') {
		const displayLabel = field.label || field.name;

		// Handle different field types
		let displayValue: string | boolean | number | unknown;
		if (Array.isArray(value)) {
			displayValue = value.join(', ');
		} else if (field.type === 'textarea' && typeof value === 'string' && value.length > 100) {
			displayValue = `${value.substring(0, 100)}...`;
		} else {
			displayValue = value;
		}

		console.log(`${displayLabel}:`, displayValue);
	}
}

export function logDryRunMetadata(metadata: Record<string, string>): void {
	for (const [key, value] of Object.entries(metadata)) {
		if (value) {
			console.log(`${key}:`, value);
		}
	}
}

export function logDryRunMessage(message: string): void {
	console.log('');
	console.log(message);
	console.log('');
}

/**
 * Complete dry-run console output handler
 */
export function logDryRunResults<T extends Record<string, unknown>>(
	data: T,
	fields: Array<CliField>,
	title: string,
	metadata: Record<string, string>,
	message: string,
): void {
	logDryRunTitle(title);

	// Display field data
	for (const field of fields) {
		const value = data[field.name];
		logDryRunField(field, value);
	}

	// Display metadata
	logDryRunMetadata(metadata);

	// Display final message
	logDryRunMessage(message);
}
