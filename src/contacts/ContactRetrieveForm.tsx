import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface ContactRetrieveFormProps {
	onExit: () => void;
}

export const ContactRetrieveForm = ({ onExit }: ContactRetrieveFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="👤 Resend CLI - Retrieve Contact">
			<Alert variant="warning">ContactRetrieveForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
