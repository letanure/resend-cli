import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface ApiKeyListFormProps {
	onExit: () => void;
}

export const ApiKeyListForm = ({ onExit }: ApiKeyListFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});
	
	return (
		<Layout headerText="🔑 Resend CLI - List API Keys">
			<Alert variant="warning">ApiKeyListForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};