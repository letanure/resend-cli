import type { CliField } from '@/types/index.js';

/**
 * Formats array data as a CLI table
 */
export function formatAsTable(data: Array<Record<string, unknown>>, fields: Array<CliField>): string {
	if (data.length === 0) {
		return 'No data found';
	}

	// Calculate column widths
	const columnWidths: Record<string, number> = {};
	for (const field of fields) {
		// Start with header width
		columnWidths[field.name] = field.label.length;

		// Check data widths
		for (const row of data) {
			const value = String(row[field.name] || '');
			const currentWidth = columnWidths[field.name] || 0;
			columnWidths[field.name] = Math.max(currentWidth, value.length);
		}

		// Add some padding and set minimum width
		const finalWidth = columnWidths[field.name] || 0;
		columnWidths[field.name] = Math.max(finalWidth + 2, 8);
	}

	const lines: Array<string> = [];

	// Header row
	const headerParts: Array<string> = [];
	for (const field of fields) {
		const width = columnWidths[field.name] || 8;
		headerParts.push(field.label.padEnd(width));
	}
	lines.push(` ${headerParts.join(' ')}`);

	// Separator line
	const separatorParts: Array<string> = [];
	for (const field of fields) {
		const width = columnWidths[field.name] || 8;
		separatorParts.push('-'.repeat(width));
	}
	lines.push(` ${separatorParts.join(' ')}`);

	// Data rows
	for (const row of data) {
		const rowParts: Array<string> = [];
		for (const field of fields) {
			const width = columnWidths[field.name] || 8;
			const value = String(row[field.name] || '');
			rowParts.push(value.padEnd(width));
		}
		lines.push(` ${rowParts.join(' ')}`);
	}

	// Footer
	lines.push('');
	lines.push(`${data.length} ${data.length === 1 ? 'item' : 'items'} total`);

	return lines.join('\n');
}
