import { Spinner } from '@inkjs/ui';
import { useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
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
	const [successData, setSuccessData] = useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = useState(false);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

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

	const handleSubmit = async (data: CancelEmailOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Email ID': data.id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Email not cancelled due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await cancelEmail(data.id, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						'Email ID': data.id,
						'Cancel Status': 'Successfully cancelled',
						'Object Type': result.data.object,
						'Cancelled At': new Date().toISOString(),
					});
					setIsDryRunSuccess(false);
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

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Email Cancelled Successfully"
				headerText={`${config.baseTitle} - Emails - Cancel`}
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
