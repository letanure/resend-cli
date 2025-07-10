import type { ListApiKeysResponseSuccess } from 'resend';
import { ListDisplay } from '@/components/ui/ListDisplay.js';
import { listApiKeys } from './action.js';
import { displayFields } from './fields.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const formatData = (data: ListApiKeysResponseSuccess) => {
		// Handle both possible response structures: direct array or nested object
		let apiKeys: Array<{ id: string; name: string; created_at: string }> = [];

		if (Array.isArray(data)) {
			// Direct array format
			apiKeys = data;
		} else if (data && typeof data === 'object' && 'data' in data) {
			// Nested object format: { data: ApiKey[] }
			const nested = data as { data: Array<{ id: string; name: string; created_at: string }> };
			apiKeys = Array.isArray(nested.data) ? nested.data : [];
		}

		return apiKeys.map((key) => ({
			id: key.id,
			name: key.name,
			created_at: key.created_at,
		}));
	};

	// Note: listApiKeys doesn't use loadData parameter, but we need to match the signature
	const loadFunction = async (_data: Record<string, unknown>, apiKey: string) => {
		return listApiKeys(apiKey);
	};

	return (
		<ListDisplay
			title="API Keys - List"
			onExit={onExit}
			loadFunction={loadFunction}
			displayFields={displayFields}
			formatData={formatData}
			loadData={{}}
			noDataMessage="No API keys found."
		/>
	);
};
