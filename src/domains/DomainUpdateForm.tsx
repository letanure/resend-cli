import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';

interface DomainUpdateFormProps {
	onExit: () => void;
}

export const DomainUpdateForm = ({ onExit }: DomainUpdateFormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Domains - Update`}>
			<Alert variant="warning">DomainUpdateForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
