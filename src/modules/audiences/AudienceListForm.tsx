import { ListAudienceForm } from './list/Form.js';

interface AudienceListFormProps {
	onExit: () => void;
}

export const AudienceListForm = ({ onExit }: AudienceListFormProps) => {
	return <ListAudienceForm onExit={onExit} />;
};
