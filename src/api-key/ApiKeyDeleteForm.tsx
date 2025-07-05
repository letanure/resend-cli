import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';
import { config } from '../config.js';

interface ApiKeyDeleteFormProps {
	onExit: () => void;
}

export const ApiKeyDeleteForm = ({ onExit }: ApiKeyDeleteFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - API Keys - Delete`}>
			<Alert variant="warning">ApiKeyDeleteForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
