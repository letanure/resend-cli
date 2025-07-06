import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';

interface DomainDeleteFormProps {
	onExit: () => void;
}

export const DomainDeleteForm = ({ onExit }: DomainDeleteFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Domains - Delete`}>
			<Alert variant="warning">DomainDeleteForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
