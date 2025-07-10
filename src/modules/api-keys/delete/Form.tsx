import { Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { deleteApiKey } from './action.js';
import { fields } from './fields.js';
import { type DeleteApiKeyData, deleteApiKeySchema } from './schema.js';

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

	// Handle Esc/Left arrow key to go back from result screens
	useInput(
		(_input, key) => {
			if ((key.escape || key.leftArrow) && (successData || error)) {
				setSuccessData(null);
				setIsDryRunSuccess(false);
				setError(null);
			}
		},
		{ isActive: !!(successData || error) },
	);

	const handleSubmit = async (data: DeleteApiKeyData) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'API Key ID': data.api_key_id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (API key not deleted due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await deleteApiKey(data, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						'API Key ID': data.api_key_id,
						'Object Type': 'api_key',
						Status: 'Deleted successfully',
					});
					setIsDryRunSuccess(false);
				} else {
					setError({
						title: 'API Key Deletion Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the API key ID and ensure it exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'API Key Deletion Error',
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
				headerText={`${config.baseTitle} - API Keys - Delete`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Deleting API key..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="API Key Deleted Successfully"
				headerText={`${config.baseTitle} - API Keys - Delete`}
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
				headerText={`${config.baseTitle} - API Keys - Delete`}
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

	return (
		<Layout
			headerText={`${config.baseTitle} - API Keys - Delete`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<Box flexDirection="column">
				<SimpleForm<DeleteApiKeyData>
					fields={fields}
					onSubmit={handleSubmit}
					onCancel={onExit}
					validateWith={deleteApiKeySchema}
				/>
			</Box>
		</Layout>
	);
};
