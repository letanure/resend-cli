import { Alert } from '@inkjs/ui';
import { Box, Text } from 'ink';
import type React from 'react';
import { useDryRun } from '@/contexts/DryRunProvider.js';

interface LayoutProps {
	children: React.ReactNode;
	headerText?: string;
	footerText?: string;
	showNavigationInstructions?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ headerText, footerText, showNavigationInstructions, children }) => {
	const { isDryRun } = useDryRun();

	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1}>
				<Text bold={true} color="blue">
					{headerText}
				</Text>
			</Box>

			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE: Operations will be validated but not executed.</Alert>
				</Box>
			)}

			{children}

			<Box marginTop={1}>
				{showNavigationInstructions && (
					<Box marginBottom={1}>
						<Text dimColor={true}>
							Use <Text color="yellow">↑/↓</Text> to navigate, <Text color="yellow">Enter/→</Text> to select{' '}
							<Text color="yellow">q</Text>/<Text color="yellow">ESC/←</Text> to go back
						</Text>
					</Box>
				)}
				<Text dimColor={true}>{footerText}</Text>
			</Box>
		</Box>
	);
};
