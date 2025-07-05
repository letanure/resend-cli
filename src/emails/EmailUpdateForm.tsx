import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';
import { config } from '../config.js';

interface EmailUpdateFormProps {
	onExit: () => void;
}

export const EmailUpdateForm = ({ onExit }: EmailUpdateFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});
	return (
		<Layout headerText={`${config.baseTitle} - Emails - Update`}>
			<Alert variant="warning">EmailUpdateForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
