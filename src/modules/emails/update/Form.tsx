import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { EmailDisplay } from '../shared/EmailDisplay.js';
import { updateEmail } from './action.js';
import { fields } from './fields.js';
import { UpdateEmailOptionsSchema, type UpdateEmailOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [updateResult, setUpdateResult] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (updateResult || showDryRunData || error)) {
				setUpdateResult(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(updateResult || showDryRunData || error) },
	);

	const handleSubmit = async (data: UpdateEmailOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Email ID': data.id,
					'New Scheduled Date': data.scheduledAt,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Email not updated due to dry-run mode)',
				});
			} else {
				const result = await updateEmail(data, apiKey);

				if (result.success && result.data) {
					setUpdateResult({
						'Email ID': data.id,
						'New Scheduled Date': data.scheduledAt,
						'Update Status': 'Successfully updated',
						'Object Type': result.data.object,
						'Updated At': new Date().toISOString(),
					});
				} else {
					setError({
						title: 'Email Update Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the email ID and ensure it exists and is scheduled for future delivery',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Email Update Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout headerText={`${config.baseTitle} - Emails - Update`}>
				<Spinner label="Updating email..." />
			</Layout>
		);
	}

	if (updateResult) {
		return (
			<Layout headerText={`${config.baseTitle} - Emails - Update - Success`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<EmailDisplay data={updateResult} title="Email Updated Successfully" />
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
			<Layout headerText={`${config.baseTitle} - Emails - Update - Dry Run`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<EmailDisplay data={showDryRunData} title="DRY RUN - Email update data (validation only)" />
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
			<Layout headerText={`${config.baseTitle} - Emails - Update - Error`}>
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
		<Layout headerText={`${config.baseTitle} - Emails - Update`}>
			<SimpleForm<UpdateEmailOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={UpdateEmailOptionsSchema}
			/>
		</Layout>
	);
};
