import { Alert, Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
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
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
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
		if (isDryRun) {
			setSuccessData({
				'Broadcast ID': data.broadcastId,
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Broadcast not retrieved due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await retrieveBroadcast(data, apiKey);
			if (result.success && result.data) {
				setSuccessData({
					ID: result.data.id,
					Name: result.data.name || 'Not provided',
					Status: result.data.status,
					'Audience ID': result.data.audience_id || 'Not provided',
					From: result.data.from || 'Not provided',
					Subject: result.data.subject || 'Not provided',
					Created: new Date(result.data.created_at).toLocaleString(),
					Scheduled: result.data.scheduled_at ? new Date(result.data.scheduled_at).toLocaleString() : 'Not scheduled',
					Sent: result.data.sent_at ? new Date(result.data.sent_at).toLocaleString() : 'Not sent',
				});
				setIsDryRunSuccess(false);
			} else {
				setResult(result);
			}
		}
		setLoading(false);
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading) {
			onExit();
		}
	});

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Broadcast Retrieved Successfully"
				headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

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
