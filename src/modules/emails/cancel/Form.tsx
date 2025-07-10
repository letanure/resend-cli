import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { EmailDisplay } from '../shared/EmailDisplay.js';
import { cancelEmail } from './action.js';
import { fields } from './fields.js';
import { CancelEmailOptionsSchema, type CancelEmailOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [cancelResult, setCancelResult] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (cancelResult || showDryRunData || error)) {
				setCancelResult(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(cancelResult || showDryRunData || error) },
	);

	const handleSubmit = async (data: CancelEmailOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Email ID': data.id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Email not cancelled due to dry-run mode)',
				});
			} else {
				const result = await cancelEmail(data.id, apiKey);

				if (result.success && result.data) {
					setCancelResult({
						'Email ID': data.id,
						'Cancel Status': 'Successfully cancelled',
						'Object Type': result.data.object,
						'Cancelled At': new Date().toISOString(),
					});
				} else {
					setError({
						title: 'Email Cancellation Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the email ID and ensure it exists and is scheduled for future delivery',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Email Cancellation Error',
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
				headerText={`${config.baseTitle} - Emails - Cancel`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Cancelling email..." />
			</Layout>
		);
	}

	if (cancelResult) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Emails - Cancel - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<EmailDisplay data={cancelResult} title="Email Cancelled Successfully" />
					</Box>
					<Box>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Emails - Cancel - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<EmailDisplay data={showDryRunData} title="DRY RUN - Email cancellation data (validation only)" />
					</Box>
					<Box>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	if (error) {
		return (
			<ErrorScreen
				title={error.title}
				message={error.message}
				suggestion={error.suggestion}
				headerText={`${config.baseTitle} - Emails - Cancel`}
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
			headerText={`${config.baseTitle} - Emails - Cancel`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<CancelEmailOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={CancelEmailOptionsSchema}
			/>
		</Layout>
	);
};
