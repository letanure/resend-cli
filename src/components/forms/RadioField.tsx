import { Box, Text } from 'ink';
import type { RadioOption } from '@/types/index.js';

interface RadioFieldProps {
	label: string;
	options: Array<RadioOption>;
	value: string | boolean;
	isActive: boolean;
	helpText?: string;
	errorMessage?: string;
	labelWidth?: number;
	onToggle: () => void;
}

export const RadioField = ({
	label,
	options,
	value,
	isActive,
	helpText,
	errorMessage,
	labelWidth = 22,
	onToggle: _onToggle,
}: RadioFieldProps) => {
	const labelColor = isActive ? 'cyan' : 'white';

	return (
		<Box flexDirection="column">
			<Box>
				<Box width={labelWidth}>
					<Text bold={true} color={labelColor}>
						{label}:
					</Text>
				</Box>
				<Box flexDirection="row">
					{options.map((option, index) => {
						const isSelected = option.value === value;
						const checkbox = isSelected ? '[✓]' : '[ ]';
						const textColor = isSelected ? option.color || 'green' : 'gray';

						return (
							<Box key={String(option.value)} marginRight={index < options.length - 1 ? 1 : 0}>
								<Text color={textColor}>
									{checkbox} {option.label}
								</Text>
								{index < options.length - 1 && <Text color="gray"> | </Text>}
							</Box>
						);
					})}
					{isActive && <Text color="gray"> (Use ←/→ or Space)</Text>}
				</Box>
			</Box>

			{/* Always reserve space for help text to prevent footer movement */}
			<Box marginLeft={labelWidth} marginTop={0} minHeight={1}>
				{isActive && helpText && !errorMessage && <Text dimColor={true}>{helpText}</Text>}
				{errorMessage && <Text color="red">{errorMessage}</Text>}
				{/* Reserve space when no help text is shown */}
				{!isActive && !errorMessage && <Text> </Text>}
			</Box>
		</Box>
	);
};
