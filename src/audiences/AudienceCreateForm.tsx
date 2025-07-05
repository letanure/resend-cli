import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface AudienceCreateFormProps {
	onExit: () => void;
}

export const AudienceCreateForm = ({ onExit }: AudienceCreateFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="👥 Resend CLI - Create Audience">
			<Alert variant="warning">AudienceCreateForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
