import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { retrieveAudience } from './action.js';
import { fields } from './fields.js';
import { RetrieveAudienceOptionsSchema, type RetrieveAudienceOptionsType } from './schema.js';

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

	const handleSubmit = async (data: RetrieveAudienceOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Audience ID': data.id,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Audience not retrieved due to dry-run mode)',
				});
			} else {
				const result = await retrieveAudience(data, apiKey);

				if (result.success && result.data) {
					setAudienceData({
						'Audience ID': result.data.id,
						Name: result.data.name,
						'Object Type': result.data.object,
						'Created At': result.data.created_at,
					});
				} else {
					setError({
						title: 'Audience Retrieval Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the audience ID and ensure it exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Audience Retrieval Error',
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
				headerText={`${config.baseTitle} - Audiences - Retrieve`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Retrieving audience..." />
			</Layout>
		);
	}

	if (audienceData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Audiences - Retrieve - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>Audience Retrieved Successfully</Text>
					</Box>
					{Object.entries(audienceData).map(([key, value]) => (
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
				headerText={`${config.baseTitle} - Audiences - Retrieve - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>DRY RUN - Audience retrieval data (validation only)</Text>
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
				headerText={`${config.baseTitle} - Audiences - Retrieve - Error`}
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
			headerText={`${config.baseTitle} - Audiences - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<RetrieveAudienceOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={RetrieveAudienceOptionsSchema}
			/>
		</Layout>
	);
};
