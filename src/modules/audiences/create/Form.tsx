import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { createAudience } from './action.js';
import { fields } from './fields.js';
import { CreateAudienceOptionsSchema, type CreateAudienceOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

interface AudienceDisplayProps {
	data: Record<string, unknown>;
	title: string;
}

const AudienceDisplay = ({ data, title }: AudienceDisplayProps) => {
	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold={true} color="green">
					{title}
				</Text>
			</Box>
			{Object.entries(data).map(([key, value]) => (
				<Box key={key}>
					<Box width={15}>
						<Text bold={true} color="cyan">
							{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
						</Text>
					</Box>
					<Text>{String(value)}</Text>
				</Box>
			))}
		</Box>
	);
};

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [createResult, setCreateResult] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (createResult || showDryRunData || error)) {
				setCreateResult(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(createResult || showDryRunData || error) },
	);

	const handleSubmit = async (data: CreateAudienceOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Audience Name': data.name,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Audience not created due to dry-run mode)',
				});
			} else {
				const result = await createAudience(data, apiKey);

				if (result.success && result.data) {
					setCreateResult({
						'Audience ID': result.data.id,
						Name: result.data.name,
						'Object Type': result.data.object,
					});
				} else {
					setError({
						title: 'Audience Creation Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check your API key and audience name',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Audience Creation Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - Create`}>
				<Spinner label="Creating audience..." />
			</Layout>
		);
	}

	if (createResult) {
		return (
			<Layout headerText={`${config.baseTitle} - Audiences - Create - Success`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<AudienceDisplay data={createResult} title="Audience Created Successfully" />
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
			<Layout headerText={`${config.baseTitle} - Audiences - Create - Dry Run`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<AudienceDisplay data={showDryRunData} title="DRY RUN - Audience creation data (validation only)" />
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
			<Layout headerText={`${config.baseTitle} - Audiences - Create - Error`}>
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
		<Layout headerText={`${config.baseTitle} - Audiences - Create`}>
			<SimpleForm<CreateAudienceOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={CreateAudienceOptionsSchema}
			/>
		</Layout>
	);
};
