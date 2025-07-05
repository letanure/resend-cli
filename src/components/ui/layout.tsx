import { Box, Text } from 'ink';
import type React from 'react';

interface DomainsMenuProps {
	children: React.ReactNode;
	headerText?: string;
	footerText?: string;
	showNavigationInstructions?: boolean;
}

export const Layout: React.FC<DomainsMenuProps> = ({
	headerText,
	footerText,
	showNavigationInstructions,
	children,
}) => {
	return (
		<Box flexDirection="column" padding={1}>
			<Text bold={true} color="blue">
				{headerText}
			</Text>

			{children}

			<Box marginTop={1}>
				{showNavigationInstructions && (
					<Box marginBottom={1}>
						<Text dimColor={true}>
							Use <Text color="yellow">↑/↓</Text> to navigate, <Text color="yellow">Enter</Text> to select{' '}
							<Text color="yellow">q</Text> or <Text color="yellow">ESC</Text> to go back
						</Text>
					</Box>
				)}
				<Text dimColor={true}>{footerText}</Text>
			</Box>
		</Box>
	);
};
