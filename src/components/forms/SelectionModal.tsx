import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';

export interface SelectableItem {
	id: string;
	[key: string]: unknown;
}

interface SelectionModalProps<T extends SelectableItem, D = Record<string, unknown>> {
	title: string;
	isOpen: boolean;
	onSelect: (item: T) => void;
	onCancel: () => void;
	loadFunction: (data: D, apiKey: string) => Promise<ApiResult<{ data: Array<T> }>>;
	formatData: (data: { data: Array<T> }) => Array<Record<string, unknown>>;
	loadData?: D;
	noDataMessage?: string;
	idField?: string;
	displayField?: string;
}

const DEFAULT_LOAD_DATA = {} as Record<string, unknown>;

export function SelectionModal<T extends SelectableItem, D = Record<string, unknown>>({
	title,
	isOpen,
	onSelect,
	onCancel,
	loadFunction,
	formatData,
	loadData = DEFAULT_LOAD_DATA as D,
	noDataMessage = 'No items found.',
	idField = 'id',
	displayField = 'id',
}: SelectionModalProps<T, D>) {
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

		if (key.escape || input === 'q') {
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
			const items = result.data.data;
			const tableData = formatData(result.data);

			return (
				<Layout
					headerText={`${config.baseTitle} - ${title} - Select`}
					showNavigationInstructions={true}
					navigationContext="result"
					footerText="↑/↓ navigate • Space/Enter select • Esc cancel"
				>
					<Box flexDirection="column">
						{tableData.length === 0 ? (
							<Box marginBottom={1}>
								<Text color="gray">{noDataMessage}</Text>
							</Box>
						) : (
							<Box flexDirection="column">
								{tableData.map((row, index) => {
									const isSelected = index === selectedIndex;
									const item = items[index];
									const displayValue = String(row[displayField] || row[idField] || '');

									const keyValue = item?.[idField] ? String(item[idField]) : `item-${index}`;
									return (
										<Box key={keyValue} marginBottom={1}>
											<Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
												{isSelected ? '►' : ' '} {displayValue}
											</Text>
										</Box>
									);
								})}
							</Box>
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
				footerText="Press Esc to cancel"
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
			footerText="Press Esc to cancel"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
		</Layout>
	);
}
