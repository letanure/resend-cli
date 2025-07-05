import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface DomainCreateFormProps {
	onExit: () => void;
}

export const DomainCreateForm = ({ onExit }: DomainCreateFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="🌍 Resend CLI - Create Domain">
			<Alert variant="warning">DomainCreateForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
