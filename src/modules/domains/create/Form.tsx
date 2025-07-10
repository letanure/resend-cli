import { Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { createDomain } from './action.js';
import { fields } from './fields.js';
import { type CreateDomainData, createDomainSchema } from './schema.js';

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

	const handleSubmit = async (data: CreateDomainData) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Domain Name': data.name,
					Region: data.region || 'us-east-1',
					'Custom Return Path': data.custom_return_path || 'send',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (Domain not created due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await createDomain(data, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						'Domain ID': result.data.id,
						'Domain Name': result.data.name,
						Region: result.data.region,
						Status: result.data.status,
						'Created At': result.data.created_at,
						'Records Count': result.data.records?.length || 0,
					});
					setIsDryRunSuccess(false);
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
			<Layout
				headerText={`${config.baseTitle} - Domains - Create`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Creating domain..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Domain Created Successfully"
				headerText={`${config.baseTitle} - Domains - Create`}
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
				headerText={`${config.baseTitle} - Domains - Create`}
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
			headerText={`${config.baseTitle} - Domains - Create`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
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
