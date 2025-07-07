import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useEffect, useState } from 'react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { Table } from '@/components/ui/Table.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { listAudiences } from './action.js';
import { displayFields } from './fields.js';

interface AudienceListFormProps {
	onExit: () => void;
}

export const ListAudienceForm = ({ onExit }: AudienceListFormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isLoading, setIsLoading] = useState(true);
	const [audienceList, setAudienceList] = useState<Array<Record<string, unknown>> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Array<Record<string, unknown>> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back
	useInput(
		(_input, key) => {
			if (key.escape) {
				onExit();
			}
		},
		{ isActive: true },
	);

	// Load audiences on mount
	useEffect(() => {
		const loadAudiences = async () => {
			setIsLoading(true);
			try {
				if (isDryRun) {
					// Show mock data for dry run
					setShowDryRunData([
						{
							id: 'dry-run-audience-1',
							name: 'Sample Audience 1',
							created_at: '2023-10-06T22:59:55.977Z',
						},
						{
							id: 'dry-run-audience-2',
							name: 'Sample Audience 2',
							created_at: '2023-10-07T10:30:12.123Z',
						},
					]);
				} else {
					const result = await listAudiences(apiKey);

					if (result.success && result.data) {
						// Convert the list response to array format for table
						const audiences = result.data.data || [];
						setAudienceList(
							audiences.map((audience) => ({
								id: audience.id,
								name: audience.name,
								created_at: audience.created_at,
							})),
						);
					} else {
						setError({
							title: 'Failed to Load Audiences',
							message: result.error || 'Unknown error occurred',
							suggestion: 'Check your API key and network connection',
						});
					}
				}
			} catch (error) {
				setError({
					title: 'Audience List Error',
					message: error instanceof Error ? error.message : 'Unknown error',
					suggestion: 'Please check your API key and network connection',
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadAudiences();
	}, [apiKey, isDryRun]);

	if (isLoading) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - List`}>
				<Spinner label="Loading audiences..." />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - List - Error`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<ErrorDisplay title={error.title} message={error.message} suggestion={error.suggestion} />
					</Box>
					<Box>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	if (showDryRunData) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - List - Dry Run`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true} color="yellow">
							DRY RUN - Sample audience list data (not from API)
						</Text>
					</Box>
					<Table data={showDryRunData} fields={displayFields} title="Audiences" />
					<Box marginTop={1}>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - Audiences - List`}>
			<Box flexDirection="column">
				<Table data={audienceList || []} fields={displayFields} title="Audiences" />
				<Box marginTop={1}>
					<Text dimColor={true}>Press Esc to go back</Text>
				</Box>
			</Box>
		</Layout>
	);
};
