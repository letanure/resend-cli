import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface EmailBatchFormProps {
	onExit: () => void;
}

export const EmailBatchForm = ({ onExit }: EmailBatchFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});
	return (
		<Layout headerText="📧 Resend CLI - Email Send Form">
			<Alert variant="warning">EmailBatchForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
