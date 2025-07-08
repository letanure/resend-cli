import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import type { ListDomainsResponseSuccess } from 'resend';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { Table } from '@/components/ui/Table.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { listDomains } from './action.js';
import { displayFields } from './fields.js';

interface DomainListFormProps {
	onExit: () => void;
}

export const DomainListForm = ({ onExit }: DomainListFormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const [isLoading, setIsLoading] = useState(true);
	const [domainsList, setDomainsList] = useState<Array<Record<string, unknown>> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Array<Record<string, unknown>> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (domainsList || showDryRunData || error)) {
				setDomainsList(null);
				setShowDryRunData(null);
				setError(null);
				setIsLoading(true);
			} else if (key.escape) {
				onExit();
			}
		},
		{ isActive: !isLoading },
	);

	// Auto-start when component mounts
	useState(() => {
		const startListDomains = async () => {
			try {
				if (isDryRun) {
					// Mock data for dry run
					const mockData: Array<Record<string, unknown>> = [
						{
							id: 'domain-123',
							name: 'example.com',
							status: 'verified',
							created_at: new Date().toISOString(),
							region: 'us-east-1',
						},
						{
							id: 'domain-456',
							name: 'test.com',
							status: 'pending',
							created_at: new Date().toISOString(),
							region: 'eu-west-1',
						},
					];
					setShowDryRunData(mockData);
				} else {
					const result: ApiResult<ListDomainsResponseSuccess> = await listDomains({}, apiKey);
					if (result.success && result.data) {
						setDomainsList(result.data.data as unknown as Array<Record<string, unknown>>);
					} else {
						setError({
							title: 'Failed to List Domains',
							message: result.error || 'An unexpected error occurred while fetching domains.',
							suggestion: 'Please check your internet connection and API key, then try again.',
						});
					}
				}
			} catch (err) {
				setError({
					title: 'Unexpected Error',
					message: err instanceof Error ? err.message : 'An unexpected error occurred.',
					suggestion: 'Please try again. If the problem persists, check your API configuration.',
				});
			} finally {
				setIsLoading(false);
			}
		};

		void startListDomains();
	});

	// Show loading state
	if (isLoading) {
		return (
			<Layout headerText={`${config.baseTitle} - Domains - List`}>
				<Box marginBottom={1}>
					<Spinner label="Loading domains..." />
				</Box>
			</Layout>
		);
	}

	// Show error state
	if (error) {
		return (
			<Layout headerText={`${config.baseTitle} - Domains - List`}>
				<ErrorDisplay title={error.title} message={error.message} suggestion={error.suggestion} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> to go back and try again
					</Text>
				</Box>
			</Layout>
		);
	}

	// Show dry run results
	if (showDryRunData) {
		return (
			<Layout headerText={`${config.baseTitle} - Domains - List`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true} color="yellow">
							DRY RUN - Sample domains list data (not from API)
						</Text>
					</Box>
					<Table data={showDryRunData} fields={displayFields} title="Domains" />
					<Box marginTop={1}>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	// Show successful results
	if (domainsList) {
		return (
			<Layout headerText={`${config.baseTitle} - Domains - List`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true} color="cyan">
							{domainsList.length} domain{domainsList.length === 1 ? '' : 's'} found
						</Text>
					</Box>

					{domainsList.length > 0 ? (
						<Table data={domainsList} fields={displayFields} title="Domains" />
					) : (
						<Box marginBottom={1}>
							<Text color="yellow">No domains found. Create your first domain to get started.</Text>
						</Box>
					)}

					<Box marginTop={1}>
						<Text>
							Press <Text color="yellow">Esc</Text> to go back
						</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	// Fallback (should not reach here)
	return (
		<Layout headerText={`${config.baseTitle} - Domains - List`}>
			<ErrorDisplay title="No Data" message="No domains data available." />
			<Box marginTop={1}>
				<Text>
					Press <Text color="yellow">Esc</Text> to go back
				</Text>
			</Box>
		</Layout>
	);
};
