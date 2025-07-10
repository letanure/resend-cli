import { Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React, { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useAudienceSelector, useContactSelector } from '@/hooks/index.js';
import { deleteContact } from './action.js';
import { deleteContactFields } from './fields.js';
import { DeleteContactOptionsSchema, type DeleteContactOptionsType } from './schema.js';

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
	const [selectedAudienceId, setSelectedAudienceId] = useState<string>('');
	const [selectedContactId, setSelectedContactId] = useState<string>('');

	// Get initial data from selected IDs
	const initialFormData = React.useMemo(() => {
		const data: Record<string, unknown> = {};
		if (selectedAudienceId) {
			data.audienceId = selectedAudienceId;
		}
		if (selectedContactId) {
			data.id = selectedContactId;
		}
		return Object.keys(data).length > 0 ? data : undefined;
	}, [selectedAudienceId, selectedContactId]);

	// Selector for audiences
	const audienceSelector = useAudienceSelector((audienceId: string) => setSelectedAudienceId(audienceId));

	// Selector for contacts
	const contactSelector = useContactSelector({
		audienceId: selectedAudienceId,
		onSelect: (contactId: string) => setSelectedContactId(contactId),
	});

	// Create form fields with selector callbacks
	const formFields = React.useMemo(() => {
		return deleteContactFields.map((field) => {
			if (field.name === 'audienceId') {
				return {
					...field,
					onSelectorOpen: () => audienceSelector.openSelector(),
				};
			}
			if (field.name === 'id') {
				return {
					...field,
					onSelectorOpen: () => contactSelector.openSelector(),
				};
			}
			return field;
		});
	}, [audienceSelector, contactSelector]);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if (key.escape && (successData || error)) {
				setSuccessData(null);
				setIsDryRunSuccess(false);
				setError(null);
			}
		},
		{ isActive: !!(successData || error) },
	);

	const handleSubmit = async (data: DeleteContactOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Audience ID': data.audienceId,
					'Contact ID': data.id || 'Not provided',
					'Contact Email': data.email || 'Not provided',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Contact not deleted due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await deleteContact(data, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						Contact: result.data.contact,
						'Object Type': result.data.object,
						Deleted: String(result.data.deleted),
					});
					setIsDryRunSuccess(false);
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

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Contact Deleted Successfully"
				headerText={`${config.baseTitle} - Contacts - Delete`}
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
				headerText={`${config.baseTitle} - Contacts - Delete`}
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

	// Show selectors when open
	if (audienceSelector.isOpen) {
		return audienceSelector.selectorComponent;
	}

	if (contactSelector.isOpen) {
		return contactSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Contacts - Delete`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<Box flexDirection="column">
				<SimpleForm<DeleteContactOptionsType>
					fields={formFields}
					onSubmit={handleSubmit}
					onCancel={onExit}
					validateWith={DeleteContactOptionsSchema}
					initialData={initialFormData}
				/>
			</Box>
		</Layout>
	);
};
