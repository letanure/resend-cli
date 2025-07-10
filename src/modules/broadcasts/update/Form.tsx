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
import { useAudienceSelector, useBroadcastSelector } from '@/hooks/index.js';
import type { ApiResult } from '@/types/index.js';
import { updateBroadcast } from './action.js';
import { updateBroadcastFields } from './fields.js';
import { type UpdateBroadcastData, updateBroadcastSchema } from './schema.js';

interface UpdateBroadcastResponse {
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<UpdateBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
	const [selectedBroadcastId, setSelectedBroadcastId] = React.useState<string>('');
	const [selectedAudienceId, setSelectedAudienceId] = React.useState<string>('');
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	// Get initial data from selected IDs
	const initialFormData = React.useMemo(() => {
		const data: Record<string, unknown> = {};
		if (selectedBroadcastId) {
			data.broadcastId = selectedBroadcastId;
		}
		if (selectedAudienceId) {
			data.audienceId = selectedAudienceId;
		}
		return Object.keys(data).length > 0 ? data : undefined;
	}, [selectedBroadcastId, selectedAudienceId]);

	// Selector for broadcasts
	const broadcastSelector = useBroadcastSelector((broadcastId: string) => setSelectedBroadcastId(broadcastId));

	// Selector for audiences
	const audienceSelector = useAudienceSelector((audienceId: string) => setSelectedAudienceId(audienceId));

	// Create form fields with selector callbacks
	const formFields = React.useMemo(() => {
		return updateBroadcastFields.map((field) => {
			if (field.name === 'broadcastId') {
				return {
					...field,
					onSelectorOpen: () => broadcastSelector.openSelector(),
				};
			}
			if (field.name === 'audienceId') {
				return {
					...field,
					onSelectorOpen: () => audienceSelector.openSelector(),
				};
			}
			return field;
		});
	}, [broadcastSelector, audienceSelector]);

	const handleSubmit = async (data: UpdateBroadcastData) => {
		setLoading(true);
		if (isDryRun) {
			setSuccessData({
				'Broadcast ID': data.broadcastId,
				Name: data.name || 'Not provided',
				Subject: data.subject || 'Not provided',
				From: data.from || 'Not provided',
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Broadcast not updated due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await updateBroadcast(data, apiKey);
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
				successMessage="Broadcast Updated Successfully"
				headerText={`${config.baseTitle} - Broadcasts - Update`}
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
				headerText={`${config.baseTitle} - Broadcasts - Update`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Updating broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		return (
			<ErrorScreen
				title="Broadcast Update Failed"
				message={result.error || 'Failed to update broadcast'}
				suggestion="Check the broadcast ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Broadcasts - Update`}
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

	// Show selectors when open
	if (broadcastSelector.isOpen) {
		return broadcastSelector.selectorComponent;
	}

	if (audienceSelector.isOpen) {
		return audienceSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Update`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<UpdateBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={updateBroadcastSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
