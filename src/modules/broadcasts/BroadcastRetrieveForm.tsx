import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';

interface BroadcastRetrieveFormProps {
	onExit: () => void;
}

export const BroadcastRetrieveForm = ({ onExit }: BroadcastRetrieveFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts - Retrieve`}>
			<Alert variant="warning">BroadcastRetrieveForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
