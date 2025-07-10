import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { listApiKeys } from '@/modules/api-keys/list/action.js';
import { displayFields } from '@/modules/api-keys/list/fields.js';

export function useApiKeySelector(onSelect: (apiKeyId: string) => void) {
	return useInputSelector({
		title: 'API Keys',
		loadFunction: async (_data: Record<string, unknown>, apiKey: string) => {
			const result = await listApiKeys(apiKey);
			if (result.success && result.data) {
				// The API response directly contains the data array
				const apiKeysData = result.data as unknown as { data: Array<{ id: string; name: string; created_at: string }> };
				const transformedData = apiKeysData.data.map((key) => ({
					id: key.id,
					name: key.name,
					created_at: key.created_at,
				}));
				return {
					...result,
					data: { data: transformedData },
				};
			}
			return {
				success: false,
				error: result.error || 'Failed to load API keys',
			};
		},
		formatData: (data) => {
			return data.data.map((key) => ({
				id: key.id,
				name: key.name,
				created_at: new Date(key.created_at as string).toLocaleString(),
			}));
		},
		displayFields,
		loadData: {},
		noDataMessage: 'No API keys found.',
		onSelect,
	});
}
