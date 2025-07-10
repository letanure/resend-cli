import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { Table } from '@/components/ui/Table.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { listApiKeys } from './action.js';
import { displayFields } from './fields.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isLoading, setIsLoading] = useState(true);
	const [apiKeyList, setApiKeyList] = useState<Array<Record<string, unknown>> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Array<Record<string, unknown>> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back
	useInput(
		(_input, key) => {
			if (key.escape || key.leftArrow) {
				onExit();
			}
		},
		{ isActive: true },
	);

	// Load API keys on mount
	useEffect(() => {
		const loadApiKeys = async () => {
			setIsLoading(true);
			try {
				if (isDryRun) {
					// Show mock data for dry run
					setShowDryRunData([
						{
							id: 'dry-run-api-key-1',
							name: 'Production API Key',
							created_at: '2023-10-06T22:59:55.977Z',
						},
						{
							id: 'dry-run-api-key-2',
							name: 'Development API Key',
							created_at: '2023-10-07T10:30:12.123Z',
						},
					]);
				} else {
					const result = await listApiKeys(apiKey);

					if (result.success && result.data) {
						// Handle both possible response structures: direct array or nested object
						let apiKeys: Array<{ id: string; name: string; created_at: string }> = [];

						if (Array.isArray(result.data)) {
							// Direct array format
							apiKeys = result.data;
						} else if (result.data && typeof result.data === 'object' && 'data' in result.data) {
							// Nested object format: { data: ApiKey[] }
							const nested = result.data as { data: Array<{ id: string; name: string; created_at: string }> };
							apiKeys = Array.isArray(nested.data) ? nested.data : [];
						}

						setApiKeyList(
							apiKeys.map((key) => ({
								id: key.id,
								name: key.name,
								created_at: key.created_at,
							})),
						);
					} else {
						setError({
							title: 'Failed to Load API Keys',
							message: result.error || 'Unknown error occurred',
							suggestion: 'Check your API key and network connection',
						});
					}
				}
			} catch (error) {
				setError({
					title: 'API Key List Error',
					message: error instanceof Error ? error.message : 'Unknown error',
					suggestion: 'Please check your API key and network connection',
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadApiKeys();
	}, [apiKey, isDryRun]);

	if (isLoading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - API Keys - List`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Loading API keys..." />
			</Layout>
		);
	}

	if (error) {
		return (
			<ErrorScreen
				title={error.title}
				message={error.message}
				suggestion={error.suggestion}
				headerText={`${config.baseTitle} - API Keys - List`}
				onExit={onExit}
				showRetry={true}
				onRetry={() => {
					setError(null);
					setIsLoading(true);
				}}
			/>
		);
	}

	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - API Keys - List - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true} color="yellow">
							DRY RUN - Sample API key list data (not from API)
						</Text>
					</Box>
					<Table data={showDryRunData} fields={displayFields} title="API Keys" />
				</Box>
			</Layout>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - API Keys - List`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
			<Box flexDirection="column">
				<Table data={apiKeyList || []} fields={displayFields} title="API Keys" />
			</Box>
		</Layout>
	);
};
