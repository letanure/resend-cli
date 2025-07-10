import { listAudiences } from '@audiences/list/action.js';
import { Alert, Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React from 'react';
import type { CreateBroadcastResponseSuccess } from 'resend';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { createBroadcast } from './action.js';
import { createBroadcastFields } from './fields.js';
import { type CreateBroadcastData, createBroadcastSchema } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<CreateBroadcastResponseSuccess> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [selectedAudienceId, setSelectedAudienceId] = React.useState<string>('');
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const initialFormData = React.useMemo(() => {
		return selectedAudienceId ? { audienceId: selectedAudienceId } : undefined;
	}, [selectedAudienceId]);

	const audienceSelector = useInputSelector({
		title: 'Audiences',
		loadFunction: async (data: Record<string, unknown>, apiKey: string) => {
			const result = await listAudiences(data, apiKey);
			if (result.success && result.data) {
				// Transform audiences to SelectableItem format
				const transformedData = result.data.data.map((audience) => ({
					id: audience.id,
					name: audience.name,
					created_at: audience.created_at,
				}));
				return {
					...result,
					data: { data: transformedData },
				};
			}
			return {
				success: false,
				error: result.error || 'Failed to load audiences',
			};
		},
		formatData: (data) => {
			return data.data.map((audience) => ({
				id: audience.id,
				name: audience.name,
				created_at: new Date(audience.created_at as string).toLocaleString(),
			}));
		},
		loadData: {},
		noDataMessage: 'No audiences found.',
		idField: 'id',
		displayField: 'name',
		onSelect: (audienceId) => {
			// Update component state to trigger re-render
			setSelectedAudienceId(audienceId);
		},
	});

	// Create form fields with audience selector
	const formFields = React.useMemo(() => {
		return createBroadcastFields.map((field) => {
			if (field.name === 'audienceId') {
				return {
					...field,
					type: 'input-with-selector' as const,
					onSelectorOpen: audienceSelector.openSelector,
				};
			}
			return field;
		});
	}, [audienceSelector.openSelector]);

	const handleSubmit = async (data: CreateBroadcastData) => {
		setLoading(true);
		const result = await createBroadcast(data, apiKey);
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
			<Layout
				headerText={`${config.baseTitle} - Broadcasts - Create`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Creating broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return (
				<SuccessScreen
					data={result.data as unknown as Record<string, unknown>}
					successMessage="Broadcast Created Successfully"
					headerText={`${config.baseTitle} - Broadcasts - Create`}
					fieldsToShow={['id']}
					isDryRun={false}
					onExit={onExit}
				/>
			);
		}
		return (
			<ErrorScreen
				title="Broadcast Creation Failed"
				message={result.error || 'Failed to create broadcast'}
				suggestion="Check your API key and broadcast data"
				headerText={`${config.baseTitle} - Broadcasts - Create`}
				onExit={onExit}
				showRetry={true}
				onRetry={() => {
					setResult(null);
					setLoading(false);
				}}
			/>
		);
	}

	// If the audience selector is open, render it instead of the form
	if (audienceSelector.isOpen) {
		return audienceSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Create`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<CreateBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={createBroadcastSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
