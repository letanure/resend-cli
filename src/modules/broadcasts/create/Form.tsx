import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useAudienceSelector } from '@/hooks/index.js';
import { createBroadcast } from './action.js';
import { createBroadcastFields } from './fields.js';
import { type CreateBroadcastData, createBroadcastSchema } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { apiKey } = useResend();
	const [selectedAudienceId, setSelectedAudienceId] = React.useState<string>('');

	// Get initial data from selected IDs
	const initialFormData = React.useMemo(() => {
		const data: Record<string, unknown> = {};
		if (selectedAudienceId) {
			data.audienceId = selectedAudienceId;
		}
		return Object.keys(data).length > 0 ? data : undefined;
	}, [selectedAudienceId]);

	// Selector for audiences
	const audienceSelector = useAudienceSelector((audienceId: string) => setSelectedAudienceId(audienceId));

	// Create form fields with selector callbacks
	const formFields = React.useMemo(() => {
		return createBroadcastFields.map((field) => {
			if (field.name === 'audienceId') {
				return {
					...field,
					onSelectorOpen: () => audienceSelector.openSelector(),
				};
			}
			return field;
		});
	}, [audienceSelector]);

	const handleSubmit = async (data: CreateBroadcastData) => {
		return await createBroadcast(data, apiKey);
	};

	// Show selector when open
	if (audienceSelector.isOpen) {
		return audienceSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Create`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<CreateBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={createBroadcastSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
