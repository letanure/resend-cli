import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { deleteAudience } from './action.js';
import { fields } from './fields.js';
import { DeleteAudienceOptionsSchema, type DeleteAudienceOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [audienceData, setAudienceData] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (audienceData || showDryRunData || error)) {
				setAudienceData(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(audienceData || showDryRunData || error) },
	);

	const handleSubmit = async (data: DeleteAudienceOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Audience ID': data.id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Audience not deleted due to dry-run mode)',
				});
			} else {
				const result = await deleteAudience(data, apiKey);

				if (result.success && result.data) {
					setAudienceData({
						'Audience ID': result.data.id,
						'Object Type': result.data.object,
						Deleted: String(result.data.deleted),
					});
				} else {
					setError({
						title: 'Audience Deletion Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the audience ID and ensure it exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Audience Deletion Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - Delete`}>
				<Spinner label="Deleting audience..." />
			</Layout>
		);
	}

	if (audienceData) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - Delete - Success`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>Audience Deleted Successfully</Text>
					</Box>
					{Object.entries(audienceData).map(([key, value]) => (
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
			<Layout headerText={`${config.baseTitle} - Audiences - Delete - Dry Run`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>DRY RUN - Audience deletion data (validation only)</Text>
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
			<Layout headerText={`${config.baseTitle} - Audiences - Delete - Error`}>
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
		<Layout headerText={`${config.baseTitle} - Audiences - Delete`}>
			<Box flexDirection="column">
				<SimpleForm<DeleteAudienceOptionsType>
					fields={fields}
					onSubmit={handleSubmit}
					onCancel={onExit}
					validateWith={DeleteAudienceOptionsSchema}
				/>
			</Box>
		</Layout>
	);
};
