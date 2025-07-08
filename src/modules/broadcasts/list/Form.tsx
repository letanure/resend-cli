import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { listBroadcasts } from './action.js';
import { type ListBroadcastsData, listBroadcastsSchema } from './schema.js';

interface BroadcastItem {
	id: string;
	audience_id: string;
	status: 'draft' | 'sent' | 'queued';
	created_at: string;
	scheduled_at: string | null;
	sent_at: string | null;
}

interface ListBroadcastsResponse {
	object: 'list';
	data: Array<BroadcastItem>;
}

interface BroadcastListFormProps {
	onExit: () => void;
}

export const BroadcastListForm = ({ onExit }: BroadcastListFormProps) => {
	const [result, setResult] = React.useState<ApiResult<ListBroadcastsResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleLoad = React.useCallback(async () => {
		setLoading(true);
		const data: ListBroadcastsData = {};
		const validationResult = listBroadcastsSchema.safeParse(data);
		if (validationResult.success) {
			const result = await listBroadcasts(validationResult.data, apiKey);
			setResult(result);
		}
		setLoading(false);
	}, [apiKey]);

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
			<Layout headerText={`${config.baseTitle} - Broadcasts - List`}>
				<Box marginBottom={1}>
					<Spinner label="Loading broadcasts..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <BroadcastListDisplay result={result.data} onExit={onExit} onRefresh={handleLoad} />;
		}
		return (
			<Layout headerText={`${config.baseTitle} - Broadcasts - List`}>
				<ErrorDisplay message={result.error || 'Failed to load broadcasts'} />
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
		<Layout headerText={`${config.baseTitle} - Broadcasts - List`}>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<Text>
				Press <Text color="yellow">r</Text> to load broadcasts, <Text color="yellow">Esc</Text> or{' '}
				<Text color="yellow">q</Text> to go back
			</Text>
		</Layout>
	);
};

interface BroadcastListDisplayProps {
	result: ListBroadcastsResponse;
	onExit: () => void;
	onRefresh: () => void;
}

const BroadcastListDisplay = ({ result, onExit, onRefresh }: BroadcastListDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
		if (input === 'r') {
			onRefresh();
		}
	});

	const formatStatus = (status: string) => {
		const statusColors = {
			draft: 'yellow',
			sent: 'green',
			queued: 'blue',
		} as const;
		return statusColors[status as keyof typeof statusColors] || 'gray';
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) {
			return 'N/A';
		}
		return new Date(dateString).toLocaleString();
	};

	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts - List`}>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Text bold={true} color="cyan">
						Found {result.data.length} broadcast{result.data.length === 1 ? '' : 's'}
					</Text>
				</Box>

				{result.data.length === 0 ? (
					<Box>
						<Text color="gray">No broadcasts found.</Text>
					</Box>
				) : (
					<Box flexDirection="column" gap={1}>
						{result.data.map((broadcast) => (
							<Box key={broadcast.id} flexDirection="column" paddingLeft={2} marginBottom={1}>
								<Box>
									<Box width={12}>
										<Text bold={true} color="cyan">
											ID:
										</Text>
									</Box>
									<Text color="gray">{broadcast.id}</Text>
								</Box>
								<Box>
									<Box width={12}>
										<Text bold={true} color="cyan">
											Audience:
										</Text>
									</Box>
									<Text color="gray">{broadcast.audience_id}</Text>
								</Box>
								<Box>
									<Box width={12}>
										<Text bold={true} color="cyan">
											Status:
										</Text>
									</Box>
									<Text color={formatStatus(broadcast.status)}>{broadcast.status}</Text>
								</Box>
								<Box>
									<Box width={12}>
										<Text bold={true} color="cyan">
											Created:
										</Text>
									</Box>
									<Text color="gray">{formatDate(broadcast.created_at)}</Text>
								</Box>
								{broadcast.scheduled_at && (
									<Box>
										<Box width={12}>
											<Text bold={true} color="cyan">
												Scheduled:
											</Text>
										</Box>
										<Text color="gray">{formatDate(broadcast.scheduled_at)}</Text>
									</Box>
								)}
								{broadcast.sent_at && (
									<Box>
										<Box width={12}>
											<Text bold={true} color="cyan">
												Sent:
											</Text>
										</Box>
										<Text color="gray">{formatDate(broadcast.sent_at)}</Text>
									</Box>
								)}
							</Box>
						))}
					</Box>
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
};
