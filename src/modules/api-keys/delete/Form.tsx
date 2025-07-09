import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
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
	const [apiKeyData, setApiKeyData] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc/Left arrow key to go back from result screens
	useInput(
		(_input, key) => {
			if ((key.escape || key.leftArrow) && (apiKeyData || showDryRunData || error)) {
				setApiKeyData(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(apiKeyData || showDryRunData || error) },
	);

	const handleSubmit = async (data: DeleteApiKeyData) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'API Key ID': data.api_key_id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (API key not deleted due to dry-run mode)',
				});
			} else {
				const result = await deleteApiKey(data, apiKey);

				if (result.success && result.data) {
					setApiKeyData({
						'API Key ID': data.api_key_id,
						'Object Type': 'api_key',
						Status: 'Deleted successfully',
					});
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

	if (apiKeyData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - API Keys - Delete - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>API Key Deleted Successfully</Text>
					</Box>
					{Object.entries(apiKeyData).map(([key, value]) => (
						<Box key={key} marginBottom={0}>
							<Text>
								<Text bold={true}>{key}:</Text> {String(value)}
							</Text>
						</Box>
					))}
				</Box>
			</Layout>
		);
	}

	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - API Keys - Delete - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>DRY RUN - API key deletion data (validation only)</Text>
					</Box>
					{Object.entries(showDryRunData).map(([key, value]) => (
						<Box key={key} marginBottom={0}>
							<Text>
								<Text bold={true}>{key}:</Text> {String(value)}
							</Text>
						</Box>
					))}
				</Box>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout
				headerText={`${config.baseTitle} - API Keys - Delete - Error`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<ErrorDisplay title={error.title} message={error.message} suggestion={error.suggestion} />
					</Box>
				</Box>
			</Layout>
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
