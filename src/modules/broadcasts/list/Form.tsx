import { ListDisplay } from '@/components/ui/ListDisplay.js';
import { listBroadcasts } from './action.js';
import { displayFields } from './fields.js';

interface BroadcastItem {
	id: string;
	audience_id: string | null;
	status: 'draft' | 'sent' | 'queued';
	created_at: string;
	scheduled_at: string | null;
	sent_at: string | null;
}

interface ListBroadcastsResponse {
	object: 'list';
	data: Array<BroadcastItem>;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const formatData = (data: ListBroadcastsResponse) => {
		return data.data.map((broadcast) => ({
			id: broadcast.id,
			audience_id: broadcast.audience_id || '',
			status: broadcast.status,
			created_at: new Date(broadcast.created_at).toLocaleString(),
			scheduled_at: broadcast.scheduled_at ? new Date(broadcast.scheduled_at).toLocaleString() : '',
			sent_at: broadcast.sent_at ? new Date(broadcast.sent_at).toLocaleString() : '',
		}));
	};

	return (
		<ListDisplay
			title="Broadcasts - List"
			onExit={onExit}
			loadFunction={listBroadcasts}
			displayFields={displayFields}
			formatData={formatData}
			loadData={{}}
			noDataMessage="No broadcasts found."
		/>
	);
};
