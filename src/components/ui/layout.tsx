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
				{`🌐 Resend CLI ${headerText}`}
			</Text>
			{showNavigationInstructions && (
				<Box marginBottom={1}>
					<Text dimColor={true}>Use ↑/↓ to navigate, Enter to select, 'q' to go back</Text>
				</Box>
			)}

			{children}

			<Box marginTop={1}>
				<Text dimColor={true}>{footerText}</Text>
			</Box>
		</Box>
	);
};
