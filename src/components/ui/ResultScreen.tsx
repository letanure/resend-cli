import { Alert } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import { Layout } from './layout.js';

export type ResultType = 'success' | 'error';

interface ResultScreenProps {
	type: ResultType;
	message: string;
	onContinue: () => void;
	headerText: string;
}

/**
 * Generic result screen component that displays a success or error message
 * and waits for user input to continue
 *
 * @param type - Type of result: 'success' or 'error'
 * @param message - Message to display
 * @param onContinue - Callback when user presses any key to continue
 * @param headerText - Header text for the layout
 */
export const ResultScreen = ({ type, message, onContinue, headerText }: ResultScreenProps) => {
	useInput((_input, _key) => {
		onContinue();
	});

	return (
		<Layout headerText={headerText} footerText="Press any key to continue...">
			<Box flexDirection="column" marginTop={1}>
				<Alert variant={type}>{message}</Alert>
			</Box>
		</Layout>
	);
};
