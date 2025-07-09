import { Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import { useState } from 'react';
import type { CreateEmailOptions } from 'resend';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { EmailDisplay } from '../shared/EmailDisplay.js';
import { EMAIL_DETAIL_FIELDS } from '../shared/fields.js';
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
	const [sentEmailData, setSentEmailData] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc/Left arrow key to go back from result screens
	useInput(
		(_input, key) => {
			if ((key.escape || key.leftArrow) && (sentEmailData || showDryRunData || error)) {
				setSentEmailData(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(sentEmailData || showDryRunData || error) },
	);

	const handleSubmit = async (validatedData: CreateEmailOptionsType) => {
		setIsSubmitting(true);
		try {
			// In dry-run mode, show validated data
			if (isDryRun) {
				setShowDryRunData({
					...validatedData,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Email not sent due to dry-run mode)',
				});
			} else {
				// Send the email
				const result = await sendEmail(validatedData as CreateEmailOptions, apiKey);

				if (result.success && result.data) {
					// Show the sent email data
					setSentEmailData({
						...validatedData,
						id: result.data.id,
						created_at: new Date().toISOString(),
						last_event: 'sent',
					});
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

	if (sentEmailData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Emails - Send - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<EmailDisplay data={sentEmailData} title="Email Sent Successfully" fieldsToShow={EMAIL_DETAIL_FIELDS} />
					</Box>
				</Box>
			</Layout>
		);
	}

	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Emails - Send - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<EmailDisplay data={showDryRunData} title="DRY RUN - Email send data (validation only)" />
					</Box>
				</Box>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Emails - Send - Error`}
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
