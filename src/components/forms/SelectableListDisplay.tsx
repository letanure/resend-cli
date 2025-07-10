import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult, CliField } from '@/types/index.js';
import { clipContent } from '@/utils/clipContent.js';

export interface SelectableItem {
	id: string;
	[key: string]: unknown;
}

interface SelectableListDisplayProps<T extends SelectableItem, D = Record<string, unknown>> {
	title: string;
	isOpen: boolean;
	onSelect: (item: T) => void;
	onCancel: () => void;
	loadFunction: (data: D, apiKey: string) => Promise<ApiResult<{ data: Array<T> }>>;
	formatData: (data: { data: Array<T> }) => Array<Record<string, unknown>>;
	displayFields: Array<CliField>;
	loadData?: D;
	noDataMessage?: string;
}

const DEFAULT_LOAD_DATA = {} as Record<string, unknown>;

interface SelectableTableProps {
	data: Array<Record<string, unknown>>;
	fields: Array<CliField>;
	selectedIndex: number;
	title?: string;
}

const SelectableTable = ({ data, fields, selectedIndex, title }: SelectableTableProps) => {
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
			{data.map((row, index) => {
				const isSelected = index === selectedIndex;
				return (
					<Box key={String(row.id || index)}>
						{fields.map((field, fieldIndex) => {
							const width = columnWidths[field.name] || 8;
							const rawValue = String(row[field.name] || '');
							const clippedValue = clipContent(rawValue, field.name);
							let displayValue: string;
							if (fieldIndex === 0) {
								// First column gets selection indicator
								const prefix = isSelected ? '► ' : '  ';
								const availableWidth = width - 1 - prefix.length;
								const truncatedValue =
									clippedValue.length > availableWidth ? clippedValue.substring(0, availableWidth) : clippedValue;
								displayValue = `${prefix}${truncatedValue}`.padEnd(width - 1);
							} else {
								// Other columns just get padded
								displayValue = clippedValue.padEnd(width - 1);
							}
							return (
								<Box key={field.name} width={width}>
									<Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
										{displayValue}
									</Text>
								</Box>
							);
						})}
					</Box>
				);
			})}

			{/* Footer */}
			<Box marginTop={1}>
				<Text dimColor={true}>
					{data.length} {data.length === 1 ? 'item' : 'items'} total
				</Text>
			</Box>
		</Box>
	);
};

export function SelectableListDisplay<T extends SelectableItem, D = Record<string, unknown>>({
	title,
	isOpen,
	onSelect,
	onCancel,
	loadFunction,
	formatData,
	displayFields,
	loadData = DEFAULT_LOAD_DATA as D,
	noDataMessage = 'No items found.',
}: SelectableListDisplayProps<T, D>) {
	const [result, setResult] = React.useState<ApiResult<{ data: Array<T> }> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleLoad = React.useCallback(async () => {
		setLoading(true);
		const loadResult = await loadFunction(loadData, apiKey);
		setResult(loadResult);
		setLoading(false);
	}, [loadFunction, loadData, apiKey]);

	React.useEffect(() => {
		if (isOpen && !isDryRun) {
			handleLoad();
		}
	}, [isOpen, handleLoad, isDryRun]);

	useInput((input, key) => {
		if (!isOpen) {
			return;
		}

		if (key.escape || key.leftArrow || input === 'q') {
			onCancel();
		} else if (result?.success && result.data?.data) {
			const items = result.data.data;

			if (key.upArrow) {
				setSelectedIndex(Math.max(0, selectedIndex - 1));
			} else if (key.downArrow) {
				setSelectedIndex(Math.min(items.length - 1, selectedIndex + 1));
			} else if (key.return || input === ' ') {
				const selectedItem = items[selectedIndex];
				if (selectedItem) {
					onSelect(selectedItem);
				}
			}
		}
	});

	if (!isOpen) {
		return null;
	}

	if (loading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - ${title} - Select`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label={`Loading ${title.toLowerCase()}...`} />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data?.data) {
			const tableData = formatData(result.data);

			return (
				<Layout
					headerText={`${config.baseTitle} - ${title} - Select`}
					showNavigationInstructions={true}
					navigationContext="result"
					footerText="↑/↓ navigate • Space/Enter select • Esc/← cancel"
				>
					<Box flexDirection="column">
						{tableData.length === 0 ? (
							<Box marginBottom={1}>
								<Text color="gray">{noDataMessage}</Text>
							</Box>
						) : (
							<SelectableTable data={tableData} fields={displayFields} selectedIndex={selectedIndex} title={title} />
						)}
					</Box>
				</Layout>
			);
		}

		return (
			<Layout
				headerText={`${config.baseTitle} - ${title} - Select`}
				showNavigationInstructions={true}
				navigationContext="result"
				footerText="Press Esc/← to cancel"
			>
				<ErrorDisplay message={result.error || `Failed to load ${title.toLowerCase()}`} />
			</Layout>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - ${title} - Select`}
			showNavigationInstructions={true}
			navigationContext="result"
			footerText="Press Esc/← to cancel"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
		</Layout>
	);
}
