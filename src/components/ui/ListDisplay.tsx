import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { Table } from '@/components/ui/Table.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult, CliField } from '@/types/index.js';

interface ListDisplayProps<T, D = Record<string, unknown>> {
	title: string;
	onExit: () => void;
	loadFunction: (data: D, apiKey: string) => Promise<ApiResult<T>>;
	displayFields: Array<CliField>;
	formatData: (data: T) => Array<Record<string, unknown>>;
	loadData?: D;
	noDataMessage?: string;
}

const DEFAULT_LOAD_DATA = {} as Record<string, unknown>;

export function ListDisplay<T, D = Record<string, unknown>>({
	title,
	onExit,
	loadFunction,
	displayFields,
	formatData,
	loadData = DEFAULT_LOAD_DATA as D,
	noDataMessage = 'No items found.',
}: ListDisplayProps<T, D>) {
	const [result, setResult] = React.useState<ApiResult<T> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleLoad = React.useCallback(async () => {
		setLoading(true);
		const loadResult = await loadFunction(loadData, apiKey);
		setResult(loadResult);
		setLoading(false);
	}, [loadFunction, loadData, apiKey]);

	React.useEffect(() => {
		if (!isDryRun) {
			handleLoad();
		}
	}, [handleLoad, isDryRun]);

	useInput((input, key) => {
		if ((input === 'q' || key.escape || key.leftArrow) && !loading) {
			onExit();
		}
		if (input === 'r' && !loading) {
			handleLoad();
		}
		// Prevent Enter key from doing anything (no default action for lists)
		if (key.return && !loading) {
			// Do nothing - just consume the key event
			return;
		}
	});

	if (loading) {
		return (
			<Layout headerText={`${config.baseTitle} - ${title}`} showNavigationInstructions={false} navigationContext="none">
				<Box marginBottom={1}>
					<Spinner label={`Loading ${title.toLowerCase()}...`} />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			const tableData = formatData(result.data);
			return (
				<Layout
					headerText={`${config.baseTitle} - ${title}`}
					showNavigationInstructions={true}
					navigationContext="result"
					footerText="Press r to refresh"
				>
					<Box flexDirection="column">
						{tableData.length === 0 ? (
							<Box marginBottom={1}>
								<Text color="gray">{noDataMessage}</Text>
							</Box>
						) : (
							<Table data={tableData} fields={displayFields} title={title} />
						)}
					</Box>
				</Layout>
			);
		}
		return (
			<Layout
				headerText={`${config.baseTitle} - ${title}`}
				showNavigationInstructions={true}
				navigationContext="result"
				footerText="Press r to retry"
			>
				<ErrorDisplay message={result.error || `Failed to load ${title.toLowerCase()}`} />
			</Layout>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - ${title}`}
			showNavigationInstructions={true}
			navigationContext="result"
			footerText="Press r to load"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
		</Layout>
	);
}
