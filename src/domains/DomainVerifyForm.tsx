import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '../components/ui/layout.js';

interface DomainVerifyFormProps {
	onExit: () => void;
}

export const DomainVerifyForm = ({ onExit }: DomainVerifyFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText="🌍 Resend CLI - Verify Domain">
			<Alert variant="warning">DomainVerifyForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
