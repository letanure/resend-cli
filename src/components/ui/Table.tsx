import { Box, Text } from 'ink';
import type { CliField } from '@/types/index.js';
import { clipContent } from '@/utils/clipContent.js';

interface TableProps {
	data: Array<Record<string, unknown>>;
	fields: Array<CliField>;
	title?: string;
}

export const Table = ({ data, fields, title }: TableProps) => {
	if (data.length === 0) {
		return (
			<Box flexDirection="column">
				{title && (
					<Box marginBottom={1}>
						<Text bold={true}>{title}</Text>
					</Box>
				)}
				<Text dimColor={true}>No data found</Text>
			</Box>
		);
	}

	// Calculate column widths based on content
	const columnWidths: Record<string, number> = {};
	for (const field of fields) {
		// Start with header width
		columnWidths[field.name] = field.label.length;

		// Check data widths (using clipped content for width calculation)
		for (const row of data) {
			const rawValue = String(row[field.name] || '');
			const clippedValue = clipContent(rawValue, field.name);
			const currentWidth = columnWidths[field.name] || 0;
			columnWidths[field.name] = Math.max(currentWidth, clippedValue.length);
		}

		// Add some padding and set minimum width
		const finalWidth = columnWidths[field.name] || 0;
		columnWidths[field.name] = Math.max(finalWidth + 2, 8);
	}

	return (
		<Box flexDirection="column">
			{title && (
				<Box marginBottom={1}>
					<Text bold={true}>{title}</Text>
				</Box>
			)}

			{/* Header row */}
			<Box>
				{fields.map((field) => {
					const width = columnWidths[field.name] || 8;
					return (
						<Box key={field.name} width={width}>
							<Text bold={true} color="blue">
								{field.label.padEnd(width - 1)}
							</Text>
						</Box>
					);
				})}
			</Box>

			{/* Separator line */}
			<Box>
				{fields.map((field) => {
					const width = columnWidths[field.name] || 8;
					return (
						<Box key={field.name} width={width}>
							<Text dimColor={true}>{'-'.repeat(width - 1)}</Text>
						</Box>
					);
				})}
			</Box>

			{/* Data rows */}
			{data.map((row, index) => (
				<Box key={String(row.id || index)}>
					{fields.map((field) => {
						const width = columnWidths[field.name] || 8;
						const rawValue = String(row[field.name] || '');
						const displayValue = clipContent(rawValue, field.name);
						return (
							<Box key={field.name} width={width}>
								<Text>{displayValue.padEnd(width - 1)}</Text>
							</Box>
						);
					})}
				</Box>
			))}

			{/* Footer */}
			<Box marginTop={1}>
				<Text dimColor={true}>
					{data.length} {data.length === 1 ? 'item' : 'items'} total
				</Text>
			</Box>
		</Box>
	);
};
