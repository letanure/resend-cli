import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { retrieveBroadcast } from './action.js';
import { retrieveBroadcastFields } from './fields.js';
import { type RetrieveBroadcastData, retrieveBroadcastSchema } from './schema.js';

interface RetrieveBroadcastResponse {
	object: 'broadcast';
	id: string;
	name: string | null;
	audience_id: string;
	from: string;
	subject: string;
	reply_to: Array<string> | null;
	preview_text: string | null;
	status: 'draft' | 'sent' | 'queued';
	created_at: string;
	scheduled_at: string | null;
	sent_at: string | null;
}

interface BroadcastRetrieveFormProps {
	onExit: () => void;
}

export const BroadcastRetrieveForm = ({ onExit }: BroadcastRetrieveFormProps) => {
	const [result, setResult] = React.useState<ApiResult<RetrieveBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: RetrieveBroadcastData) => {
		setLoading(true);
		const result = await retrieveBroadcast(data, apiKey);
		setResult(result);
		setLoading(false);
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading) {
			onExit();
		}
	});

	if (loading) {
		return (
			<Layout headerText={`${config.baseTitle} - Broadcasts - Retrieve`}>
				<Box marginBottom={1}>
					<Spinner label="Retrieving broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <BroadcastRetrieveDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout headerText={`${config.baseTitle} - Broadcasts - Retrieve`}>
				<ErrorDisplay message={result.error || 'Failed to retrieve broadcast'} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts - Retrieve`}>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<RetrieveBroadcastData>
				fields={retrieveBroadcastFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={retrieveBroadcastSchema}
			/>
		</Layout>
	);
};

interface BroadcastRetrieveDisplayProps {
	result: RetrieveBroadcastResponse;
	onExit: () => void;
}

const BroadcastRetrieveDisplay = ({ result, onExit }: BroadcastRetrieveDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
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
		<Layout headerText={`${config.baseTitle} - Broadcasts - Retrieve`}>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Broadcast retrieved successfully</Alert>
				</Box>

				<Box flexDirection="column">
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								ID:
							</Text>
						</Box>
						<Text color="gray">{result.id}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Name:
							</Text>
						</Box>
						<Text>{result.name || 'N/A'}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Status:
							</Text>
						</Box>
						<Text color={formatStatus(result.status)}>{result.status}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Audience ID:
							</Text>
						</Box>
						<Text color="gray">{result.audience_id}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								From:
							</Text>
						</Box>
						<Text>{result.from}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Subject:
							</Text>
						</Box>
						<Text>{result.subject}</Text>
					</Box>

					{result.reply_to && result.reply_to.length > 0 && (
						<Box>
							<Box width={20}>
								<Text bold={true} color="cyan">
									Reply To:
								</Text>
							</Box>
							<Text>{result.reply_to.join(', ')}</Text>
						</Box>
					)}

					{result.preview_text && (
						<Box>
							<Box width={20}>
								<Text bold={true} color="cyan">
									Preview:
								</Text>
							</Box>
							<Text>{result.preview_text}</Text>
						</Box>
					)}

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Created:
							</Text>
						</Box>
						<Text color="gray">{formatDate(result.created_at)}</Text>
					</Box>

					{result.scheduled_at && (
						<Box>
							<Box width={20}>
								<Text bold={true} color="cyan">
									Scheduled:
								</Text>
							</Box>
							<Text color="gray">{formatDate(result.scheduled_at)}</Text>
						</Box>
					)}

					{result.sent_at && (
						<Box>
							<Box width={20}>
								<Text bold={true} color="cyan">
									Sent:
								</Text>
							</Box>
							<Text color="gray">{formatDate(result.sent_at)}</Text>
						</Box>
					)}
				</Box>

				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Box>
		</Layout>
	);
};
