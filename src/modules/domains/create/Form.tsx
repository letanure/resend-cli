import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { createDomain } from './action.js';
import { fields } from './fields.js';
import { type CreateDomainData, createDomainSchema } from './schema.js';

interface CreateDomainFormProps {
	onExit: () => void;
}

export const CreateDomainForm = ({ onExit }: CreateDomainFormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [domainData, setDomainData] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (domainData || showDryRunData || error)) {
				setDomainData(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(domainData || showDryRunData || error) },
	);

	const handleSubmit = async (data: CreateDomainData) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setShowDryRunData({
					'Domain Name': data.name,
					Region: data.region || 'us-east-1',
					'Custom Return Path': data.custom_return_path || 'send',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Domain not created due to dry-run mode)',
				});
			} else {
				const result = await createDomain(data, apiKey);

				if (result.success && result.data) {
					setDomainData({
						'Domain ID': result.data.id,
						'Domain Name': result.data.name,
						Region: result.data.region,
						Status: result.data.status,
						'Created At': result.data.created_at,
						'Records Count': result.data.records?.length || 0,
					});
				} else {
					setError({
						title: 'Domain Creation Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the domain name and ensure it is valid and not already registered with Resend',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Domain Creation Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout headerText={`${config.baseTitle} - Domains - Create`}>
				<Spinner label="Creating domain..." />
			</Layout>
		);
	}

	if (domainData) {
		return (
			<Layout headerText={`${config.baseTitle} - Domains - Create - Success`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>Domain Created Successfully</Text>
					</Box>
					{Object.entries(domainData).map(([key, value]) => (
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
			<Layout headerText={`${config.baseTitle} - Domains - Create - Dry Run`}>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true}>DRY RUN - Domain creation data (validation only)</Text>
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
			<Layout headerText={`${config.baseTitle} - Domains - Create - Error`}>
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
		<Layout headerText={`${config.baseTitle} - Domains - Create`}>
			<Box flexDirection="column">
				<SimpleForm<CreateDomainData>
					fields={fields}
					onSubmit={handleSubmit}
					onCancel={onExit}
					validateWith={createDomainSchema}
				/>
			</Box>
		</Layout>
	);
};
