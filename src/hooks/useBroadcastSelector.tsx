import { useInputSelector } from '@/components/forms/useInputSelector.js';
import { listBroadcasts } from '@/modules/broadcasts/list/action.js';
import { displayFields } from '@/modules/broadcasts/list/fields.js';

export function useBroadcastSelector(onSelect: (broadcastId: string) => void) {
	return useInputSelector({
		title: 'Broadcasts',
		loadFunction: async (data: Record<string, unknown>, apiKey: string) => {
			const result = await listBroadcasts(data, apiKey);
			if (result.success && result.data) {
				// Transform broadcasts to SelectableItem format
				const transformedData = result.data.data.map((broadcast) => ({
					id: broadcast.id,
					name: broadcast.name,
					audienceId: broadcast.audience_id,
					status: broadcast.status,
					created_at: broadcast.created_at,
					scheduled_at: broadcast.scheduled_at,
					sent_at: broadcast.sent_at,
				}));
				return {
					...result,
					data: { data: transformedData },
				};
			}
			return {
				success: false,
				error: result.error || 'Failed to load broadcasts',
			};
		},
		formatData: (data) => {
			return data.data.map((broadcast) => ({
				id: broadcast.id,
				name: broadcast.name || '',
				audienceId: broadcast.audienceId || '',
				status: broadcast.status,
				created_at: new Date(broadcast.created_at as string).toLocaleString(),
				scheduled_at: broadcast.scheduled_at ? new Date(broadcast.scheduled_at as string).toLocaleString() : '',
				sent_at: broadcast.sent_at ? new Date(broadcast.sent_at as string).toLocaleString() : '',
			}));
		},
		displayFields,
		loadData: {},
		noDataMessage: 'No broadcasts found.',
		onSelect,
	});
}
