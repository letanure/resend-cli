import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { retrieveContact } from './action.js';
import { fields } from './fields.js';
import { RetrieveContactOptionsSchema, type RetrieveContactOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [contactData, setContactData] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (contactData || showDryRunData || error)) {
				setContactData(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(contactData || showDryRunData || error) },
	);

	const handleSubmit = async (data: RetrieveContactOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Audience ID': data.audienceId,
					'Contact ID': data.id || 'Not specified',
					Email: data.email || 'Not specified',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Contact not retrieved due to dry-run mode)',
				});
			} else {
				const result = await retrieveContact(data, apiKey);

				if (result.success && result.data) {
					setContactData({
						'Contact ID': result.data.id,
						'Object Type': result.data.object,
						Email: result.data.email,
						'First Name': result.data.first_name || 'Not specified',
						'Last Name': result.data.last_name || 'Not specified',
						'Created At': result.data.created_at,
						'Subscription Status': result.data.unsubscribed ? 'Unsubscribed' : 'Subscribed',
					});
				} else {
					setError({
						title: 'Contact Retrieval Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the contact ID/email and audience ID, and ensure they exist in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Contact Retrieval Error',
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
				headerText={`${config.baseTitle} - Contacts - Retrieve`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Retrieving contact..." />
			</Layout>
		);
	}

	if (contactData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Retrieve - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>Contact Retrieved Successfully</Text>
					</Box>
					{Object.entries(contactData).map(([key, value]) => (
						<Box key={key} marginBottom={0}>
							<Text>
								<Text bold={true}>{key}:</Text> {String(value)}
							</Text>
						</Box>
					))}
					<Box marginTop={1}>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Retrieve - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>DRY RUN - Contact retrieval data (validation only)</Text>
					</Box>
					{Object.entries(showDryRunData).map(([key, value]) => (
						<Box key={key} marginBottom={0}>
							<Text>
								<Text bold={true}>{key}:</Text> {String(value)}
							</Text>
						</Box>
					))}
					<Box marginTop={1}>
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
				headerText={`${config.baseTitle} - Contacts - Retrieve`}
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
			headerText={`${config.baseTitle} - Contacts - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<SimpleForm<RetrieveContactOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={RetrieveContactOptionsSchema}
			/>
		</Layout>
	);
};
