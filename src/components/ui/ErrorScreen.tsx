import { Box, Text, useInput } from 'ink';
import { ErrorDisplay } from './ErrorDisplay.js';
import { Layout } from './layout.js';

export interface ErrorScreenProps {
	/** Error title (defaults to 'Error') */
	title?: string;
	/** Error message to display */
	message: string;
	/** Optional suggestion for resolving the error */
	suggestion?: string;
	/** Header text for the layout */
	headerText: string;
	/** Callback when user exits */
	onExit: () => void;
	/** Show retry button/option */
	showRetry?: boolean;
	/** Callback when user retries */
	onRetry?: () => void;
}

/**
 * Standardized error screen component that provides consistent error display
 * across all modules. Replaces the need for custom error layouts.
 */
export const ErrorScreen = ({
	title = 'Error',
	message,
	suggestion,
	headerText,
	onExit,
	showRetry = false,
	onRetry,
}: ErrorScreenProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape || key.leftArrow) {
			onExit();
		}

		if (showRetry && onRetry && (input === 'r' || key.return)) {
			onRetry();
		}
	});

	return (
		<Layout headerText={headerText} showNavigationInstructions={true} navigationContext="result">
			<Box flexDirection="column">
				<Box marginBottom={1}>
					<ErrorDisplay title={title} message={message} suggestion={suggestion} />
				</Box>

				<Box marginTop={1}>
					{showRetry && onRetry ? (
						<Box flexDirection="column">
							<Text>
								Press <Text color="yellow">Enter</Text> or <Text color="yellow">r</Text> to retry •{' '}
								<Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
							</Text>
						</Box>
					) : (
						<Text>
							Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
						</Text>
					)}
				</Box>
			</Box>
		</Layout>
	);
};
