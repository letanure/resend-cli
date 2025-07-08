import { Alert } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Emails - Batch Send`}>
			<Box flexDirection="column" gap={1}>
				<Alert variant="info">Batch email functionality is coming soon!</Alert>
				<Text>This feature will allow you to send multiple emails in a single request.</Text>
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Box>
		</Layout>
	);
};
