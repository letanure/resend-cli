import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface BroadcastSendFormProps {
	onExit: () => void;
}

export const BroadcastSendForm = ({ onExit }: BroadcastSendFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="📡 Resend CLI - Send Broadcast">
			<Alert variant="warning">BroadcastSendForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
