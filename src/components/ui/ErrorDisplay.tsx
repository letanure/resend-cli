import { Alert } from '@inkjs/ui';
import { Box, Text } from 'ink';

interface ErrorDisplayProps {
	title?: string;
	message: string;
	suggestion?: string;
}

export const ErrorDisplay = ({ title = 'Error', message, suggestion }: ErrorDisplayProps) => {
	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Alert variant="error">{title}</Alert>
			</Box>
			<Box marginBottom={suggestion ? 1 : 0}>
				<Text>{message}</Text>
			</Box>
			{suggestion && (
				<Box>
					<Text color="cyan">{suggestion}</Text>
				</Box>
			)}
		</Box>
	);
};
