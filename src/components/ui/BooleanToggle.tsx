import { Box, Text } from 'ink';

interface BooleanToggleProps {
	value: boolean;
	label: string;
	helpText?: string;
}

export const BooleanToggle = ({ value, label, helpText }: BooleanToggleProps) => {
	const status = value ? 'Unsubscribed' : 'Subscribed';
	const color = value ? 'red' : 'green';
	const icon = value ? '✗' : '✓';

	return (
		<Box flexDirection="column">
			<Box>
				<Text bold={true}>{label}: </Text>
				<Text color={color}>
					{icon} {status}
				</Text>
			</Box>
			{helpText && (
				<Box marginLeft={2}>
					<Text dimColor={true}>{helpText}</Text>
				</Box>
			)}
		</Box>
	);
};
