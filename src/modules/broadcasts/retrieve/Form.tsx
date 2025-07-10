import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { listBroadcasts } from '../list/action.js';
import { retrieveBroadcast } from './action.js';
import { retrieveBroadcastFields } from './fields.js';
import { type RetrieveBroadcastData, retrieveBroadcastSchema } from './schema.js';

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
	const [selectedBroadcastId, setSelectedBroadcastId] = React.useState<string>('');
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	// Get initial data from selected broadcast ID
	const initialFormData = React.useMemo(() => {
		return selectedBroadcastId ? { broadcastId: selectedBroadcastId } : undefined;
	}, [selectedBroadcastId]);

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
			// Update component state to trigger re-render
			setSelectedBroadcastId(broadcastId);
		},
	});

	// Create form fields with broadcast selector
	const formFields = React.useMemo(() => {
		return retrieveBroadcastFields.map((field) => {
			if (field.name === 'broadcastId') {
				return {
					...field,
					type: 'input-with-selector' as const,
					onSelectorOpen: broadcastSelector.openSelector,
				};
			}
			return field;
		});
	}, [broadcastSelector.openSelector]);

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

	// If the broadcast selector is open, render it instead of the form
	if (broadcastSelector.isOpen) {
		return broadcastSelector.selectorComponent;
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
			<ErrorScreen
				title="Broadcast Retrieval Failed"
				message={result.error || 'Failed to retrieve broadcast'}
				suggestion="Check the broadcast ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
				onExit={() => {
					setResult(null);
					onExit();
				}}
				showRetry={true}
				onRetry={() => {
					setResult(null);
					setLoading(false);
				}}
			/>
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
			<SimpleForm<RetrieveBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={retrieveBroadcastSchema}
				initialData={initialFormData}
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
