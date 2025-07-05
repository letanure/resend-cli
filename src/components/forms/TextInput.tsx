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

	return (
		<Box marginBottom={1}>
			<Box minWidth={15}>
				<Text bold={true} color={isFocused ? 'cyan' : 'white'}>
					{label}:
				</Text>
			</Box>
			<Box flexGrow={1}>
				<Text color={value ? 'white' : 'gray'}>
					{showCursor && cursorPosition === 0 && '│'}
					{displayValue.split('').map((char, i) => (
						<Text key={`char-${i}-${char}`}>
							{char}
							{showCursor && i === cursorPosition - 1 && '│'}
						</Text>
					))}
					{showCursor && cursorPosition === displayValue.length && '│'}
				</Text>
				{error && <Text color="red"> {error}</Text>}
				{!error && helpText && isFocused && (
					<Text dimColor={true} color="gray">
						{' '}
						- {helpText}
					</Text>
				)}
			</Box>
		</Box>
	);
};
