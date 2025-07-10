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
import { getEmail } from './action.js';
import { fields } from './fields.js';
import { GetEmailOptionsSchema, type GetEmailOptionsType } from './schema.js';

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

	const handleSubmit = async (data: GetEmailOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Email ID': data.id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Email not retrieved due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await getEmail(data.id, apiKey);

				if (result.success && result.data) {
					setSuccessData(result.data as unknown as Record<string, unknown>);
					setIsDryRunSuccess(false);
				} else {
					setError({
						title: 'Email Retrieval Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the email ID and ensure it exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Email Retrieval Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout headerText={`${config.baseTitle} - Emails - Retrieve`}>
				<Spinner label="Retrieving email..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Email Retrieved Successfully"
				headerText={`${config.baseTitle} - Emails - Retrieve`}
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
				headerText={`${config.baseTitle} - Emails - Retrieve`}
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
			headerText={`${config.baseTitle} - Emails - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<GetEmailOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={GetEmailOptionsSchema}
			/>
		</Layout>
	);
};
