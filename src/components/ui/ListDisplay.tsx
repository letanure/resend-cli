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

export function ListDisplay<T, D = Record<string, unknown>>({
	title,
	onExit,
	loadFunction,
	displayFields,
	formatData,
	loadData = {} as D,
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
		if ((input === 'q' || key.escape) && !loading) {
			onExit();
		}
		if (input === 'r' && !loading) {
			handleLoad();
		}
	});

	if (loading) {
		return (
			<Layout headerText={`${config.baseTitle} - ${title}`}>
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
				<Layout headerText={`${config.baseTitle} - ${title}`}>
					<Box flexDirection="column">
						{tableData.length === 0 ? (
							<Box marginBottom={1}>
								<Text color="gray">{noDataMessage}</Text>
							</Box>
						) : (
							<Table data={tableData} fields={displayFields} title={title} />
						)}
						<Box marginTop={1}>
							<Text>
								Press <Text color="yellow">r</Text> to refresh, <Text color="yellow">Esc</Text> or{' '}
								<Text color="yellow">q</Text> to go back
							</Text>
						</Box>
					</Box>
				</Layout>
			);
		}
		return (
			<Layout headerText={`${config.baseTitle} - ${title}`}>
				<ErrorDisplay message={result.error || `Failed to load ${title.toLowerCase()}`} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">r</Text> to retry, <Text color="yellow">Esc</Text> or{' '}
						<Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - ${title}`}>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<Text>
				Press <Text color="yellow">r</Text> to load {title.toLowerCase()}, <Text color="yellow">Esc</Text> or{' '}
				<Text color="yellow">q</Text> to go back
			</Text>
		</Layout>
	);
}
