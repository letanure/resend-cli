import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { createContact } from './action.js';
import { fields } from './fields.js';
import { CreateContactOptionsSchema, type CreateContactOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { apiKey } = useResend();
	const { isDryRun } = useDryRun();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [createdContactData, setCreatedContactData] = useState<Record<string, unknown> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Record<string, unknown> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc/Left arrow key to go back from result screens
	useInput(
		(_input, key) => {
			if ((key.escape || key.leftArrow) && (createdContactData || showDryRunData || error)) {
				setCreatedContactData(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(createdContactData || showDryRunData || error) },
	);

	const handleSubmit = async (validatedData: CreateContactOptionsType) => {
		setIsSubmitting(true);
		try {
			// In dry-run mode, show validated data
			if (isDryRun) {
				setShowDryRunData({
					...validatedData,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Contact not created due to dry-run mode)',
				});
			} else {
				// Call the API to create contact
				const result = await createContact(validatedData, apiKey);
				if (result.success && result.data) {
					// Show success data
					setCreatedContactData({
						...validatedData,
						'Contact ID': (result.data as { id: string })?.id || 'Unknown',
						'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
						Status: 'Contact created successfully!',
					});
				} else {
					// Show error
					setError({
						title: 'Failed to Create Contact',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Please verify your API key and contact data are correct.',
					});
				}
			}
		} catch (err) {
			setError({
				title: 'Unexpected Error',
				message: err instanceof Error ? err.message : 'An unexpected error occurred',
				suggestion: 'Please try again or check your network connection.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Create - ${isDryRun ? 'Dry Run' : 'Submitting'}`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label={isDryRun ? 'Validating contact data...' : 'Creating contact...'} />
			</Layout>
		);
	}

	// Show success result (dry run)
	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Create - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column" marginTop={1}>
					<Text color="green" bold={true}>
						✓ DRY RUN - Contact Create (validation only)
					</Text>
					<Box marginBottom={1}>
						<Text color="gray">Validation successful! (Contact not created due to dry-run mode)</Text>
					</Box>
					{Object.entries(showDryRunData).map(([key, value]) => (
						<Box key={key} marginY={0}>
							<Text color="gray" dimColor={true}>
								{key}:{' '}
							</Text>
							<Text>{String(value)}</Text>
						</Box>
					))}
				</Box>
			</Layout>
		);
	}

	// Show success result (actual contact created)
	if (createdContactData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Create - Success`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column" marginTop={1}>
					<Text color="green" bold={true}>
						✓ Contact Created Successfully
					</Text>
					<Box marginBottom={1}>
						<Text color="gray">Your contact has been created and added to the audience.</Text>
					</Box>
					{Object.entries(createdContactData).map(([key, value]) => (
						<Box key={key} marginY={0}>
							<Text color="gray" dimColor={true}>
								{key}:{' '}
							</Text>
							<Text>{String(value)}</Text>
						</Box>
					))}
				</Box>
			</Layout>
		);
	}

	// Show error
	if (error) {
		return (
			<ErrorScreen
				title={error.title}
				message={error.message}
				suggestion={error.suggestion}
				headerText={`${config.baseTitle} - Contacts - Create`}
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
			headerText={`${config.baseTitle} - Contacts - Create`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<SimpleForm<CreateContactOptionsType>
				fields={fields}
				validateWith={CreateContactOptionsSchema}
				onSubmit={handleSubmit}
				onCancel={onExit}
			/>
		</Layout>
	);
};
