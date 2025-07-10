import { Alert } from '@inkjs/ui';
import { Box, Text } from 'ink';
import type React from 'react';
import { useDryRun } from '@/contexts/DryRunProvider.js';

export type NavigationContext = 'menu' | 'form' | 'form-single' | 'result' | 'error-retry' | 'root-menu' | 'none';

interface LayoutProps {
	children: React.ReactNode;
	headerText?: string;
	footerText?: string;
	showNavigationInstructions?: boolean;
	navigationContext?: NavigationContext;
}

const getNavigationInstructions = (context: NavigationContext): React.ReactNode => {
	switch (context) {
		case 'root-menu':
			return (
				<Text dimColor={true}>
					Use <Text color="yellow">↑/↓</Text> to navigate, <Text color="yellow">Enter/→</Text> to select,{' '}
					<Text color="yellow">q/ESC</Text> to quit
				</Text>
			);
		case 'menu':
			return (
				<Text dimColor={true}>
					Use <Text color="yellow">↑/↓</Text> to navigate, <Text color="yellow">Enter/→</Text> to select,{' '}
					<Text color="yellow">q/ESC/←</Text> to go back
				</Text>
			);
		case 'form':
			return (
				<Text dimColor={true}>
					<Text color="yellow">Tab/↓</Text> Next field · <Text color="yellow">Shift+Tab/↑</Text> Previous field ·{' '}
					<Text color="yellow">Enter</Text> Submit · <Text color="yellow">Esc/←</Text> Cancel
				</Text>
			);
		case 'form-single':
			return (
				<Text dimColor={true}>
					<Text color="yellow">Enter</Text> Submit · <Text color="yellow">Esc/←</Text> Cancel
				</Text>
			);
		case 'result':
			return (
				<Text dimColor={true}>
					Press <Text color="yellow">Esc/←</Text> to go back
				</Text>
			);
		case 'error-retry':
			return (
				<Text dimColor={true}>
					Press <Text color="yellow">Enter/r</Text> to retry • <Text color="yellow">Esc/←</Text> to go back
				</Text>
			);
		case 'none':
			return null;
		default:
			// Legacy fallback for backward compatibility
			return (
				<Text dimColor={true}>
					Use <Text color="yellow">↑/↓</Text> to navigate, <Text color="yellow">Enter/→</Text> to select{' '}
					<Text color="yellow">q</Text>/<Text color="yellow">ESC/←</Text> to go back
				</Text>
			);
	}
};

export const Layout: React.FC<LayoutProps> = ({
	headerText,
	footerText,
	showNavigationInstructions,
	navigationContext = 'menu',
	children,
}) => {
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
				{showNavigationInstructions && <Box marginBottom={1}>{getNavigationInstructions(navigationContext)}</Box>}
				<Text dimColor={true}>{footerText}</Text>
			</Box>
		</Box>
	);
};
