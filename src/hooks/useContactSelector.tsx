import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { listContacts } from '@/modules/contacts/list/action.js';
import { displayFields } from '@/modules/contacts/list/fields.js';

interface UseContactSelectorProps {
	audienceId: string;
	onSelect: (contactId: string) => void;
}

export function useContactSelector({ audienceId, onSelect }: UseContactSelectorProps) {
	return useInputSelector({
		title: 'Contacts',
		loadFunction: async (data: { audienceId: string }, apiKey: string) => {
			const result = await listContacts(data, apiKey);
			if (result.success && result.data) {
				// Transform contacts to SelectableItem format
				const transformedData = result.data.data.map((contact) => ({
					id: contact.id,
					email: contact.email,
					first_name: contact.first_name,
					last_name: contact.last_name,
					created_at: contact.created_at,
					unsubscribed: contact.unsubscribed,
				}));
				return {
					...result,
					data: { data: transformedData },
				};
			}
			return {
				success: false,
				error: result.error || 'Failed to load contacts',
			};
		},
		formatData: (data) => {
			return data.data.map((contact) => ({
				id: contact.id,
				email: contact.email,
				firstName: contact.first_name || '',
				lastName: contact.last_name || '',
				subscribed: contact.unsubscribed ? 'No' : 'Yes',
				created_at: new Date(contact.created_at as string).toLocaleString(),
			}));
		},
		displayFields,
		loadData: { audienceId },
		noDataMessage: 'No contacts found in this audience.',
		onSelect,
	});
}
