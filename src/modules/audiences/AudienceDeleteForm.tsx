import { DeleteAudienceForm } from './delete/Form.js';

interface AudienceDeleteFormProps {
	onExit: () => void;
}

export const AudienceDeleteForm = ({ onExit }: AudienceDeleteFormProps) => {
	return <DeleteAudienceForm onExit={onExit} />;
};
