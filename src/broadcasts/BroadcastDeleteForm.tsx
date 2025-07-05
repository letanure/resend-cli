import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface BroadcastDeleteFormProps {
	onExit: () => void;
}

export const BroadcastDeleteForm = ({ onExit }: BroadcastDeleteFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="📡 Resend CLI - Delete Broadcast">
			<Alert variant="warning">BroadcastDeleteForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
