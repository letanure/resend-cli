import { RetrieveAudienceForm } from './retrieve/Form.js';

interface AudienceRetrieveFormProps {
	onExit: () => void;
}

export const AudienceRetrieveForm = ({ onExit }: AudienceRetrieveFormProps) => {
	return <RetrieveAudienceForm onExit={onExit} />;
};
