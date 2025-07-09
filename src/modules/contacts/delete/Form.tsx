import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { deleteContact } from './action.js';
import { fields } from './fields.js';
import { DeleteContactOptionsSchema, type DeleteContactOptionsType } from './schema.js';

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

	const handleSubmit = async (data: DeleteContactOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Audience ID': data.audienceId,
					'Contact ID': data.id || 'Not provided',
					'Contact Email': data.email || 'Not provided',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Contact not deleted due to dry-run mode)',
				});
			} else {
				const result = await deleteContact(data, apiKey);

				if (result.success && result.data) {
					setContactData({
						Contact: result.data.contact,
						'Object Type': result.data.object,
						Deleted: String(result.data.deleted),
					});
				} else {
					setError({
						title: 'Contact Deletion Failed',
						message: result.error || 'Unknown error occurred',
						suggestion:
							'Check the contact ID/email and audience ID, and ensure the contact exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Contact Deletion Error',
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
				headerText={`${config.baseTitle} - Contacts - Delete`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Deleting contact..." />
			</Layout>
		);
	}

	if (contactData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Delete - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>Contact Deleted Successfully</Text>
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
				headerText={`${config.baseTitle} - Contacts - Delete - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>DRY RUN - Contact deletion data (validation only)</Text>
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
			<Layout
				headerText={`${config.baseTitle} - Contacts - Delete - Error`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<ErrorDisplay title={error.title} message={error.message} suggestion={error.suggestion} />
					</Box>
					<Box>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Contacts - Delete`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<Box flexDirection="column">
				<SimpleForm<DeleteContactOptionsType>
					fields={fields}
					onSubmit={handleSubmit}
					onCancel={onExit}
					validateWith={DeleteContactOptionsSchema}
				/>
			</Box>
		</Layout>
	);
};
