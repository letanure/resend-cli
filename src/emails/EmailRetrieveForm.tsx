import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface EmailRetrieveFormProps {
	onExit: () => void;
}

export const EmailRetrieveForm = ({ onExit }: EmailRetrieveFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});
	return (
		<Layout headerText="📧 Resend CLI - Email Send Form">
			<Alert variant="warning">EmailRetrieveForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
