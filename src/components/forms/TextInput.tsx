import { Box, Text, useInput } from 'ink';
import { useState } from 'react';

interface TextInputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	helpText?: string;
	isFocused?: boolean;
	error?: string;
}

export const TextInput = ({
	label,
	value,
	onChange,
	placeholder = '',
	helpText,
	isFocused = false,
	error,
}: TextInputProps) => {
	const [cursorPosition, setCursorPosition] = useState(value.length);

	useInput((input, key) => {
		if (!isFocused) {
			return;
		}

		if (key.leftArrow) {
			setCursorPosition(Math.max(0, cursorPosition - 1));
		} else if (key.rightArrow) {
			setCursorPosition(Math.min(value.length, cursorPosition + 1));
		} else if (key.backspace || key.delete) {
			if (cursorPosition > 0) {
				const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
				onChange(newValue);
				setCursorPosition(cursorPosition - 1);
			}
		} else if (input && !key.ctrl && !key.meta) {
			const newValue = value.slice(0, cursorPosition) + input + value.slice(cursorPosition);
			onChange(newValue);
			setCursorPosition(cursorPosition + input.length);
		}
	});

	const displayValue = value || placeholder;
	const showCursor = isFocused;

	const borderColor = error ? 'red' : isFocused ? 'cyan' : 'gray';
	const dimBorder = !!(error && !isFocused);

	return (
		<Box flexDirection="column">
			<Box>
				<Box width={15} flexDirection="row" justifyContent="flex-end" alignItems="center" height={3}>
					<Text bold={true} color={isFocused ? 'cyan' : 'white'}>
						{label}
					</Text>
					<Text> </Text>
				</Box>
				<Box flexDirection="column">
					<Box>
						<Text color={borderColor} dimColor={dimBorder}>
							┌─
						</Text>
						<Text color={borderColor} dimColor={dimBorder}>
							{'─'.repeat(60)}
						</Text>
						<Text color={borderColor} dimColor={dimBorder}>
							─┐
						</Text>
					</Box>
					<Box>
						<Text color={borderColor} dimColor={dimBorder}>
							│{' '}
						</Text>
						<Box width={60}>
							{Array.from({ length: 60 }).map((_, i) => {
								const uniqueKey = `input-${label}-pos-${i}`;
								if (showCursor && i === cursorPosition) {
									return (
										<Text key={uniqueKey} color="white">
											│
										</Text>
									);
								}
								if (i < displayValue.length) {
									return (
										<Text key={uniqueKey} color={value ? 'white' : 'gray'}>
											{displayValue[i]}
										</Text>
									);
								}
								return <Text key={uniqueKey}> </Text>;
							})}
						</Box>
						<Text color={borderColor} dimColor={dimBorder}>
							{' '}
							│
						</Text>
					</Box>
					<Box>
						<Text color={borderColor} dimColor={dimBorder}>
							└─
						</Text>
						<Text color={borderColor} dimColor={dimBorder}>
							{'─'.repeat(60)}
						</Text>
						<Text color={borderColor} dimColor={dimBorder}>
							─┘
						</Text>
					</Box>
				</Box>
			</Box>

			{!error && helpText && isFocused && (
				<Box marginLeft={15}>
					<Text dimColor={true} color="gray">
						{helpText}
					</Text>
				</Box>
			)}

			{error && (
				<Box marginLeft={15}>
					<Text color="red">{error}</Text>
				</Box>
			)}
			{!error && !(helpText && isFocused) && <Box marginBottom={1} />}
		</Box>
	);
};
