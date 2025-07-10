import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useBroadcastSelector } from '@/hooks/index.js';
import { retrieveBroadcast } from './action.js';
import { retrieveBroadcastFields } from './fields.js';
import { type RetrieveBroadcastData, retrieveBroadcastSchema } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { apiKey } = useResend();
	const [selectedBroadcastId, setSelectedBroadcastId] = React.useState<string>('');

	// Get initial data from selected IDs
	const initialFormData = React.useMemo(() => {
		const data: Record<string, unknown> = {};
		if (selectedBroadcastId) {
			data.broadcastId = selectedBroadcastId;
		}
		return Object.keys(data).length > 0 ? data : undefined;
	}, [selectedBroadcastId]);

	// Selector for broadcasts
	const broadcastSelector = useBroadcastSelector((broadcastId: string) => setSelectedBroadcastId(broadcastId));

	// Create form fields with selector callbacks
	const formFields = React.useMemo(() => {
		return retrieveBroadcastFields.map((field) => {
			if (field.name === 'broadcastId') {
				return {
					...field,
					onSelectorOpen: () => broadcastSelector.openSelector(),
				};
			}
			return field;
		});
	}, [broadcastSelector]);

	const handleSubmit = async (data: RetrieveBroadcastData) => {
		return await retrieveBroadcast(data, apiKey);
	};

	// Show selector when open
	if (broadcastSelector.isOpen) {
		return broadcastSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<RetrieveBroadcastData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={retrieveBroadcastSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
