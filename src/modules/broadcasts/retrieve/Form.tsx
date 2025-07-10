import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { InputWithSelector } from '@/components/forms/InputWithSelector.js';
import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { listBroadcasts } from '../list/action.js';
import { retrieveBroadcast } from './action.js';
import type { RetrieveBroadcastData } from './schema.js';

interface RetrieveBroadcastResponse {
	object: 'broadcast';
	id: string;
	name: string | null;
	audience_id: string | null;
	from: string | null;
	subject: string | null;
	reply_to: Array<string> | null;
	preview_text: string | null;
	status: 'draft' | 'sent' | 'queued';
	created_at: string;
	scheduled_at: string | null;
	sent_at: string | null;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<RetrieveBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [formData, setFormData] = React.useState<RetrieveBroadcastData>({ broadcastId: '' });
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	// Selector for broadcasts
	const broadcastSelector = useInputSelector({
		title: 'Broadcasts',
		loadFunction: listBroadcasts,
		formatData: (data) => {
			return data.data.map((broadcast) => ({
				id: broadcast.id,
				audience_id: broadcast.audience_id || '',
				status: broadcast.status,
				created_at: new Date(broadcast.created_at).toLocaleString(),
				scheduled_at: broadcast.scheduled_at ? new Date(broadcast.scheduled_at).toLocaleString() : '',
				sent_at: broadcast.sent_at ? new Date(broadcast.sent_at).toLocaleString() : '',
			}));
		},
		loadData: {},
		noDataMessage: 'No broadcasts found.',
		idField: 'id',
		displayField: 'id',
		onSelect: (broadcastId) => {
			setFormData((prev) => ({ ...prev, broadcastId }));
		},
	});

	const handleSubmit = async (data: RetrieveBroadcastData) => {
		setLoading(true);
		const result = await retrieveBroadcast(data, apiKey);
		setResult(result);
		setLoading(false);
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading && !broadcastSelector.isModalOpen) {
			onExit();
		}

		if (key.return && !loading && !broadcastSelector.isModalOpen && formData.broadcastId.trim()) {
			handleSubmit(formData);
		}
	});

	// If the broadcast selector modal is open, render it instead of the form
	if (broadcastSelector.isModalOpen) {
		return broadcastSelector.modalComponent;
	}

	if (loading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
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
			<Layout
				headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
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
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<Box flexDirection="column" marginTop={1}>
				<InputWithSelector
					label="Broadcast ID"
					value={formData.broadcastId}
					onChange={(value) => setFormData((prev) => ({ ...prev, broadcastId: value }))}
					placeholder="559ac32e-9ef5-46fb-82a1-b76b840c0f7b"
					helpText="Enter the broadcast ID or select from list"
					isFocused={true}
					onSelectorOpen={broadcastSelector.openModal}
				/>

				<Box marginTop={2}>
					<Text>
						Press <Text color="yellow">Enter</Text> to retrieve • <Text color="yellow">Esc</Text> to cancel
					</Text>
				</Box>
			</Box>
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
			return '';
		}
		return new Date(dateString).toLocaleString();
	};

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
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
						<Text>{result.name || ''}</Text>
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
						<Text color="gray">{result.audience_id || ''}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								From:
							</Text>
						</Box>
						<Text>{result.from || ''}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Subject:
							</Text>
						</Box>
						<Text>{result.subject || ''}</Text>
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
