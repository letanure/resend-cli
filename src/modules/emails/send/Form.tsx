import { Spinner } from '@inkjs/ui';
import { useInput } from 'ink';
import { useState } from 'react';
import type { CreateEmailOptions } from 'resend';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { sendEmail } from './action.js';
import { fields } from './fields.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { apiKey } = useResend();
	const { isDryRun } = useDryRun();
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

	const handleSubmit = async (validatedData: CreateEmailOptionsType) => {
		setIsSubmitting(true);
		try {
			// In dry-run mode, show validated data
			if (isDryRun) {
				setSuccessData({
					...validatedData,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (Email not sent due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				// Send the email
				const result = await sendEmail(validatedData as CreateEmailOptions, apiKey);

				if (result.success && result.data) {
					// Show the sent email data
					setSuccessData({
						...validatedData,
						id: result.data.id,
						created_at: new Date().toISOString(),
						last_event: 'sent',
					});
					setIsDryRunSuccess(false);
				} else {
					setError({
						title: 'Email Send Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check your API key, recipient email, and sender domain',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Email Send Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout headerText={`${config.baseTitle} - Emails - Send`}>
				<Spinner label="Sending email..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Email Sent Successfully"
				headerText={`${config.baseTitle} - Emails - Send`}
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
				headerText={`${config.baseTitle} - Emails - Send`}
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
			headerText={`${config.baseTitle} - Emails - Send`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<SimpleForm<CreateEmailOptionsType>
				fields={fields}
				validateWith={CreateEmailOptionsSchema}
				onSubmit={handleSubmit}
				onCancel={onExit}
			/>
		</Layout>
	);
};
