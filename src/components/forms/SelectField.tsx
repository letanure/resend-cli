import { Box, Text } from 'ink';
import type { SelectOption } from '@/types/index.js';

interface SelectFieldProps {
	label: string;
	options: Array<SelectOption>;
	value: string | boolean;
	isActive: boolean;
	helpText?: string;
	errorMessage?: string;
	labelWidth?: number;
	display?: 'inline' | 'stacked' | 'compact';
	onToggle: () => void;
}

export const SelectField = ({
	label,
	options,
	value,
	isActive,
	helpText,
	errorMessage,
	labelWidth = 22,
	display = 'inline',
	onToggle: _onToggle,
}: SelectFieldProps) => {
	const labelColor = isActive ? 'cyan' : 'white';
	const selectedOption = options.find((option) => option.value === value);

	// Compact display - shows current selection like a select dropdown
	if (display === 'compact') {
		return (
			<Box flexDirection="column">
				<Box>
					<Box width={labelWidth}>
						<Text bold={true} color={labelColor}>
							{label}:
						</Text>
					</Box>
					<Box flexDirection="row">
						<Text color="gray">[</Text>
						<Text bold={true}>{selectedOption?.label || 'Unknown'}</Text>
						<Text color="gray">]</Text>
						{isActive && <Text color="gray"> (Use ←/→ or Space to change)</Text>}
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
	}

	// Inline display (default) - shows all options side by side with checkboxes
	if (display === 'inline' || display === undefined) {
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

							return (
								<Box key={String(option.value)} marginRight={index < options.length - 1 ? 1 : 0}>
									<Text color={isSelected ? 'green' : 'gray'}>{isSelected ? '[✓]' : '[ ]'}</Text>
									<Text> </Text>
									<Text bold={isSelected}>{option.label}</Text>
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
	}

	// Stacked display - shows all options with checkboxes
	return (
		<Box flexDirection="column">
			<Box>
				<Box width={labelWidth}>
					<Text bold={true} color={labelColor}>
						{label}:
					</Text>
				</Box>
				<Box flexDirection="column">
					{options.map((option, index) => {
						const isSelected = option.value === value;

						return (
							<Box key={String(option.value)} marginBottom={index < options.length - 1 ? 0 : 0}>
								<Text color={isSelected ? 'green' : 'gray'}>{isSelected ? '[✓]' : '[ ]'}</Text>
								<Text> </Text>
								<Text bold={isSelected}>{option.label}</Text>
							</Box>
						);
					})}
					{isActive && (
						<Box marginTop={1}>
							<Text color="gray">(Use ←/→ or Space to change)</Text>
						</Box>
					)}
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
