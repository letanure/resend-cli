import { Spinner } from '@inkjs/ui';
import { useInput } from 'ink';
import React, { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useAudienceSelector } from '@/hooks/useAudienceSelector.js';
import { deleteAudience } from './action.js';
import { fields } from './fields.js';
import { DeleteAudienceOptionsSchema, type DeleteAudienceOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successData, setSuccessData] = useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = useState(false);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);
	const [selectedAudienceId, setSelectedAudienceId] = useState<string>('');

	const initialFormData = React.useMemo(() => {
		return selectedAudienceId ? { id: selectedAudienceId } : undefined;
	}, [selectedAudienceId]);

	const audienceSelector = useAudienceSelector((audienceId) => {
		setSelectedAudienceId(audienceId);
	});

	// Create form fields with audience selector
	const formFields = React.useMemo(() => {
		return fields.map((field) => {
			if (field.name === 'id') {
				return {
					...field,
					type: 'input-with-selector' as const,
					onSelectorOpen: audienceSelector.openSelector,
				};
			}
			return field;
		});
	}, [audienceSelector.openSelector]);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (successData || error)) {
				setSuccessData(null);
				setIsDryRunSuccess(false);
				setError(null);
			}
		},
		{ isActive: !!(successData || error) },
	);

	const handleSubmit = async (data: DeleteAudienceOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Audience ID': data.id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (Audience not deleted due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await deleteAudience(data, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						'Audience ID': result.data.id,
						'Object Type': result.data.object,
						Deleted: String(result.data.deleted),
					});
					setIsDryRunSuccess(false);
				} else {
					setError({
						title: 'Audience Deletion Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the audience ID and ensure it exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Audience Deletion Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Audiences - Delete`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Deleting audience..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Audience Deleted Successfully"
				headerText={`${config.baseTitle} - Audiences - Delete`}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

	if (error) {
		return (
			<ErrorScreen
				title={error.title}
				message={error.message}
				suggestion={error.suggestion}
				headerText={`${config.baseTitle} - Audiences - Delete`}
				onExit={() => {
					setError(null);
					onExit();
				}}
				showRetry={true}
				onRetry={() => {
					setError(null);
					setIsSubmitting(false);
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
			headerText={`${config.baseTitle} - Audiences - Delete`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<DeleteAudienceOptionsType>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={DeleteAudienceOptionsSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
