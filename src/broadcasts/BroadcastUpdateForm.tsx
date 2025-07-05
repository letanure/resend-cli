import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';
import { config } from '../config.js';

interface BroadcastUpdateFormProps {
	onExit: () => void;
}

export const BroadcastUpdateForm = ({ onExit }: BroadcastUpdateFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts - Update`}>
			<Alert variant="warning">BroadcastUpdateForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
