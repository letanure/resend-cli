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
import { deleteBroadcast } from './action.js';
import { deleteBroadcastFields } from './fields.js';
import { type DeleteBroadcastData, deleteBroadcastSchema } from './schema.js';

interface DeleteBroadcastResponse {
	object: string;
	id: string;
	deleted: boolean;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<DeleteBroadcastResponse> | null>(null);
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
		return deleteBroadcastFields.map((field) => {
			if (field.name === 'broadcastId') {
				return {
					...field,
					onSelectorOpen: () => broadcastSelector.openSelector(),
				};
			}
			return field;
		});
	}, [broadcastSelector]);

	const handleSubmit = async (data: DeleteBroadcastData) => {
		setLoading(true);
		if (isDryRun) {
			setSuccessData({
				'Broadcast ID': data.broadcastId,
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Broadcast not deleted due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await deleteBroadcast(data, apiKey);
			if (result.success && result.data) {
				setSuccessData({
					Object: result.data.object,
					'Broadcast ID': result.data.id,
					Deleted: result.data.deleted ? 'Yes' : 'No',
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
				successMessage="Broadcast Deleted Successfully"
				headerText={`${config.baseTitle} - Broadcasts - Delete`}
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
				headerText={`${config.baseTitle} - Broadcasts - Delete`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Deleting broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		return (
			<ErrorScreen
				title="Broadcast Deletion Failed"
				message={result.error || 'Failed to delete broadcast'}
				suggestion="Check the broadcast ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Broadcasts - Delete`}
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
			headerText={`${config.baseTitle} - Broadcasts - Delete`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<DeleteBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={deleteBroadcastSchema}
				initialData={initialFormData}
			/>
			<Box marginTop={1}>
				<Alert variant="info">
					Note: You can only delete broadcasts that are in draft status or scheduled broadcasts (which will cancel
					delivery).
				</Alert>
			</Box>
		</Layout>
	);
};
