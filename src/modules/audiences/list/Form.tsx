import type { ListAudiencesResponseSuccess } from 'resend';
import { ListDisplay } from '@/components/ui/ListDisplay.js';
import { listAudiences } from './action.js';
import { displayFields } from './fields.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const formatData = (data: ListAudiencesResponseSuccess) => {
		return data.data.map((audience) => ({
			id: audience.id,
			name: audience.name,
			created_at: new Date(audience.created_at).toLocaleString(),
		}));
	};

	return (
		<ListDisplay
			title="Audiences - List"
			onExit={onExit}
			loadFunction={listAudiences}
			displayFields={displayFields}
			formatData={formatData}
			loadData={{}}
			noDataMessage="No audiences found."
		/>
	);
};
