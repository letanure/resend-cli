import { Spinner } from '@inkjs/ui';
import { useInput } from 'ink';
import React, { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useAudienceSelector, useContactSelector } from '@/hooks/index.js';
import { retrieveContact } from './action.js';
import { fields } from './fields.js';
import { RetrieveContactOptionsSchema, type RetrieveContactOptionsType } from './schema.js';

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

	const initialFormData = React.useMemo(() => {
		const data: Partial<RetrieveContactOptionsType> = {};
		if (selectedAudienceId) {
			data.audienceId = selectedAudienceId;
		}
		if (selectedContactId) {
			data.id = selectedContactId;
		}
		return Object.keys(data).length > 0 ? data : undefined;
	}, [selectedAudienceId, selectedContactId]);

	const audienceSelector = useAudienceSelector((audienceId) => {
		setSelectedAudienceId(audienceId);
		// Clear contact selection when audience changes
		setSelectedContactId('');
	});

	const contactSelector = useContactSelector({
		audienceId: selectedAudienceId,
		onSelect: (contactId) => {
			setSelectedContactId(contactId);
		},
	});

	// Create form fields with selectors
	const formFields = React.useMemo(() => {
		return fields.map((field) => {
			if (field.name === 'audienceId') {
				return {
					...field,
					type: 'input-with-selector' as const,
					onSelectorOpen: audienceSelector.openSelector,
				};
			}
			if (field.name === 'id') {
				return {
					...field,
					type: 'input-with-selector' as const,
					onSelectorOpen: selectedAudienceId ? contactSelector.openSelector : undefined,
					disabled: !selectedAudienceId,
				};
			}
			return field;
		});
	}, [audienceSelector.openSelector, contactSelector.openSelector, selectedAudienceId]);

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

	const handleSubmit = async (data: RetrieveContactOptionsType) => {
		setIsSubmitting(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Audience ID': data.audienceId,
					'Contact ID': data.id || '',
					Email: data.email || '',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					'Dry Run': 'true',
					Status: 'Validation successful! (Contact not retrieved due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await retrieveContact(data, apiKey);

				if (result.success && result.data) {
					setSuccessData({
						'Contact ID': result.data.id,
						'Object Type': result.data.object,
						Email: result.data.email,
						'First Name': result.data.first_name || '',
						'Last Name': result.data.last_name || '',
						'Created At': result.data.created_at,
						'Subscription Status': result.data.unsubscribed ? 'Unsubscribed' : 'Subscribed',
					});
					setIsDryRunSuccess(false);
				} else {
					setError({
						title: 'Contact Retrieval Failed',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the contact ID/email and audience ID, and ensure they exist in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Contact Retrieval Error',
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
				headerText={`${config.baseTitle} - Contacts - Retrieve`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Retrieving contact..." />
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Contact Retrieved Successfully"
				headerText={`${config.baseTitle} - Contacts - Retrieve`}
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
				headerText={`${config.baseTitle} - Contacts - Retrieve`}
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

	// If the audience selector is open, render it instead of the form
	if (audienceSelector.isOpen) {
		return audienceSelector.selectorComponent;
	}

	// If the contact selector is open, render it instead of the form
	if (contactSelector.isOpen) {
		return contactSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Contacts - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<SimpleForm<RetrieveContactOptionsType>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={RetrieveContactOptionsSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
