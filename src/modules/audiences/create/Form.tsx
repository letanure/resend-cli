import { Spinner } from '@inkjs/ui';
import { useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { createAudience } from './action.js';
import { fields } from './fields.js';
import { CreateAudienceOptionsSchema, type CreateAudienceOptionsType } from './schema.js';

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

	const handleSubmit = async (data: CreateAudienceOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Audience Name': data.name,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (Audience not created due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await createAudience(data, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						'Audience ID': result.data.id,
						Name: result.data.name,
						'Object Type': result.data.object,
					});
					setIsDryRunSuccess(false);
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
			<Layout
				headerText={`${config.baseTitle} - Audiences - Create`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Creating audience..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Audience Created Successfully"
				headerText={`${config.baseTitle} - Audiences - Create`}
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
				headerText={`${config.baseTitle} - Audiences - Create`}
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
			headerText={`${config.baseTitle} - Audiences - Create`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<CreateAudienceOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={CreateAudienceOptionsSchema}
			/>
		</Layout>
	);
};
