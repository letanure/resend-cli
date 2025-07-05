import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface DomainListFormProps {
	onExit: () => void;
}

export const DomainListForm = ({ onExit }: DomainListFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="🌍 Resend CLI - List Domains">
			<Alert variant="warning">DomainListForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
