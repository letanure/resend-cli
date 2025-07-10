import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { listDomains } from '@/modules/domains/list/action.js';
import { displayFields } from '@/modules/domains/list/fields.js';

export function useDomainSelector(onSelect: (domainId: string) => void) {
	return useInputSelector({
		title: 'Domains',
		loadFunction: async (data: Record<string, unknown>, apiKey: string) => {
			const result = await listDomains(data, apiKey);
			if (result.success && result.data) {
				// Transform domains to SelectableItem format
				const transformedData = result.data.data.map((domain) => ({
					id: domain.id,
					name: domain.name,
					status: domain.status,
					region: domain.region,
					created_at: domain.created_at,
				}));
				return {
					...result,
					data: { data: transformedData },
				};
			}
			return {
				success: false,
				error: result.error || 'Failed to load domains',
			};
		},
		formatData: (data) => {
			return data.data.map((domain) => ({
				id: domain.id,
				name: domain.name,
				status: domain.status,
				region: domain.region,
				created_at: new Date(domain.created_at as string).toLocaleString(),
			}));
		},
		displayFields,
		loadData: {},
		noDataMessage: 'No domains found.',
		onSelect,
	});
}
