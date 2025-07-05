import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface BroadcastListFormProps {
	onExit: () => void;
}

export const BroadcastListForm = ({ onExit }: BroadcastListFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="📡 Resend CLI - List Broadcasts">
			<Alert variant="warning">BroadcastListForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
