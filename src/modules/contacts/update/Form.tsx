import { Alert, Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useAudienceSelector, useContactSelector } from '@/hooks/index.js';
import type { ApiResult } from '@/types/index.js';
import { updateContact } from './action.js';
import { updateContactFields } from './fields.js';
import { type UpdateContactData, updateContactSchema } from './schema.js';

interface UpdateContactResponse {
	object: string;
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<UpdateContactResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
	const [selectedAudienceId, setSelectedAudienceId] = React.useState<string>('');
	const [selectedContactId, setSelectedContactId] = React.useState<string>('');
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

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
		return updateContactFields.map((field) => {
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

	const handleSubmit = async (data: UpdateContactData) => {
		setLoading(true);
		if (isDryRun) {
			setSuccessData({
				'Audience ID': data.audienceId,
				'Contact ID': data.id,
				'First Name': data.firstName || 'Not provided',
				'Last Name': data.lastName || 'Not provided',
				Unsubscribed: data.unsubscribed ? 'Yes' : 'No',
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Contact not updated due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await updateContact(data, apiKey);
			if (result.success && result.data) {
				setSuccessData({
					Object: result.data.object,
					'Contact ID': result.data.id,
				});
				setIsDryRunSuccess(false);
			} else {
				setResult(result);
			}
		}
		setLoading(false);
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading) {
			onExit();
		}
	});

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Contact Updated Successfully"
				headerText={`${config.baseTitle} - Contacts - Update`}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

	if (loading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - Update`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Updating contact..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		return (
			<ErrorScreen
				title="Contact Update Failed"
				message={result.error || 'Failed to update contact'}
				suggestion="Check the contact ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Contacts - Update`}
				onExit={() => {
					setResult(null);
					onExit();
				}}
				showRetry={true}
				onRetry={() => {
					setResult(null);
					setLoading(false);
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
			headerText={`${config.baseTitle} - Contacts - Update`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<UpdateContactData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={updateContactSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
