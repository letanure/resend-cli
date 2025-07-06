import { Alert } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';

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
		<Layout headerText={`${config.baseTitle} - Contacts - Retrieve`}>
			<Alert variant="warning">ContactRetrieveForm is not implemented yet.</Alert>
			<Text>
				Use <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back.
			</Text>
		</Layout>
	);
};
