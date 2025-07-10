import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { listAudiences } from '@/modules/audiences/list/action.js';

export function useAudienceSelector(onSelect: (audienceId: string) => void) {
	return useInputSelector({
		title: 'Audiences',
		loadFunction: async (data: Record<string, unknown>, apiKey: string) => {
			const result = await listAudiences(data, apiKey);
			if (result.success && result.data) {
				// Transform audiences to SelectableItem format
				const transformedData = result.data.data.map((audience) => ({
					id: audience.id,
					name: audience.name,
					created_at: audience.created_at,
				}));
				return {
					...result,
					data: { data: transformedData },
				};
			}
			return {
				success: false,
				error: result.error || 'Failed to load audiences',
			};
		},
		formatData: (data) => {
			return data.data.map((audience) => ({
				id: audience.id,
				name: audience.name,
				created_at: new Date(audience.created_at as string).toLocaleString(),
			}));
		},
		loadData: {},
		noDataMessage: 'No audiences found.',
		idField: 'id',
		displayField: 'name',
		onSelect,
	});
}
