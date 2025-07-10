import { Alert, Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useBroadcastSelector } from '@/hooks/index.js';
import type { ApiResult } from '@/types/index.js';
import { sendBroadcast } from './action.js';
import { sendBroadcastFields } from './fields.js';
import { type SendBroadcastData, sendBroadcastSchema } from './schema.js';

interface SendBroadcastResponse {
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<SendBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
	const [selectedBroadcastId, setSelectedBroadcastId] = React.useState<string>('');
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	// Get initial data from selected IDs
	const initialFormData = React.useMemo(() => {
		const data: Record<string, unknown> = {};
		if (selectedBroadcastId) {
			data.broadcastId = selectedBroadcastId;
		}
		return Object.keys(data).length > 0 ? data : undefined;
	}, [selectedBroadcastId]);

	// Selector for broadcasts
	const broadcastSelector = useBroadcastSelector((broadcastId: string) => setSelectedBroadcastId(broadcastId));

	// Create form fields with selector callbacks
	const formFields = React.useMemo(() => {
		return sendBroadcastFields.map((field) => {
			if (field.name === 'broadcastId') {
				return {
					...field,
					onSelectorOpen: () => broadcastSelector.openSelector(),
				};
			}
			return field;
		});
	}, [broadcastSelector]);

	const handleSubmit = async (data: SendBroadcastData) => {
		setLoading(true);
		if (isDryRun) {
			setSuccessData({
				'Broadcast ID': data.broadcastId,
				'Scheduled At': data.scheduledAt || 'Send immediately',
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Broadcast not sent due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await sendBroadcast(data, apiKey);
			if (result.success && result.data) {
				setSuccessData({
					'Broadcast ID': result.data.id,
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
				successMessage="Broadcast Sent Successfully"
				headerText={`${config.baseTitle} - Broadcasts - Send`}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

	if (loading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Broadcasts - Send`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Sending broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		return (
			<ErrorScreen
				title="Broadcast Send Failed"
				message={result.error || 'Failed to send broadcast'}
				suggestion="Check the broadcast ID and ensure it exists and is ready to send."
				headerText={`${config.baseTitle} - Broadcasts - Send`}
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

	// Show selector when open
	if (broadcastSelector.isOpen) {
		return broadcastSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Send`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<SendBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={sendBroadcastSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
