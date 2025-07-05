import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface AudienceDeleteFormProps {
	onExit: () => void;
}

export const AudienceDeleteForm = ({ onExit }: AudienceDeleteFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="👥 Resend CLI - Delete Audience">
			<Alert variant="warning">AudienceDeleteForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
