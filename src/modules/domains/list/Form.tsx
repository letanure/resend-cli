import type { ListDomainsResponseSuccess } from 'resend';
import { ListDisplay } from '@/components/ui/ListDisplay.js';
import { listDomains } from './action.js';
import { displayFields } from './fields.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const formatData = (data: ListDomainsResponseSuccess) => {
		return data.data.map((domain) => ({
			id: domain.id,
			name: domain.name,
			status: domain.status,
			region: domain.region || 'N/A',
			created_at: new Date(domain.created_at).toLocaleString(),
		}));
	};

	return (
		<ListDisplay
			title="Domains - List"
			onExit={onExit}
			loadFunction={listDomains}
			displayFields={displayFields}
			formatData={formatData}
			noDataMessage="No domains found."
		/>
	);
};
