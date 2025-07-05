import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface EmailCancelFormProps {
	onExit: () => void;
}

export const EmailCancelForm = ({ onExit }: EmailCancelFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});
	return (
		<Layout headerText="📧 Resend CLI - Email Send Form">
			<Alert variant="warning">EmailCancelForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
