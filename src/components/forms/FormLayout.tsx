import { Box, Text } from 'ink';
import type { ReactNode } from 'react';

interface FormLayoutProps {
	title: string;
	description?: string;
	children: ReactNode;
}

export const FormLayout = ({ title, description, children }: FormLayoutProps) => {
	return (
		<Box flexDirection="column" padding={1}>
			<Box marginBottom={1} flexDirection="column" width={'100%'}>
				<Text bold={true} color="cyan">
					{title}
				</Text>
				{description && (
					<Text color="gray" dimColor={true}>
						{description}
					</Text>
				)}
			</Box>

			{children}
		</Box>
	);
};
