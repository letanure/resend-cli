import { Box, Text, useInput } from 'ink';
import { useState } from 'react';

interface InputWithSelectorProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	helpText?: string;
	isFocused?: boolean;
	error?: string;
	labelWidth?: number;
	disabled?: boolean;
	onSelectorOpen?: () => void;
}

type FocusState = 'input' | 'button';

export const InputWithSelector = ({
	label,
	value,
	onChange,
	placeholder = '',
	helpText,
	isFocused = false,
	error,
	labelWidth = 22,
	disabled = false,
	onSelectorOpen,
}: InputWithSelectorProps) => {
	const [cursorPosition, setCursorPosition] = useState(value.length);
	const [focusState, setFocusState] = useState<FocusState>('input');

	useInput((input, key) => {
		if (!isFocused || disabled) {
			return;
		}

		// Handle focus switching between input and button
		if (key.tab || key.rightArrow) {
			if (focusState === 'input') {
				setFocusState('button');
			} else {
				setFocusState('input');
			}
			return;
		}

		if (key.leftArrow && focusState === 'button') {
			setFocusState('input');
			return;
		}

		// Handle button actions
		if (focusState === 'button') {
			if (input === ' ' || key.return) {
				onSelectorOpen?.();
			}
			return;
		}

		// Handle input field actions (only when focused on input)
		if (focusState === 'input') {
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
		}
	});

	const displayValue = value || placeholder;
	const showCursor = isFocused && !disabled && focusState === 'input';
	const inputBorderColor = disabled ? 'gray' : error ? 'red' : isFocused && focusState === 'input' ? 'cyan' : 'gray';
	const dimInputBorder = disabled || !!(error && !isFocused);

	const buttonBorderColor = disabled ? 'gray' : isFocused && focusState === 'button' ? 'cyan' : 'gray';
	const dimButtonBorder = disabled;

	return (
		<Box flexDirection="column">
			<Box flexDirection="row">
				<Box width={labelWidth} justifyContent="flex-start" alignItems="center">
					<Text bold={true} color={disabled ? 'gray' : isFocused ? 'cyan' : 'white'} dimColor={disabled}>
						{label}
					</Text>
				</Box>
				<Box flexDirection="row">
					{/* Input field */}
					<Box flexDirection="column">
						<Box>
							<Box width={50}>
								{Array.from({ length: 50 }).map((_, i) => {
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
											<Text key={uniqueKey} color={value ? (disabled ? 'gray' : 'white') : 'gray'} dimColor={disabled}>
												{displayValue[i]}
											</Text>
										);
									}
									return <Text key={uniqueKey}> </Text>;
								})}
							</Box>
						</Box>
						<Box>
							<Text color={inputBorderColor} dimColor={dimInputBorder}>
								{'─'.repeat(50)}
							</Text>
						</Box>
					</Box>

					{/* Selector button */}
					<Box flexDirection="column" marginLeft={1}>
						<Box>
							<Box width={12}>
								<Text
									color={disabled ? 'gray' : isFocused && focusState === 'button' ? 'cyan' : 'white'}
									dimColor={disabled}
								>
									[ select ID]
								</Text>
							</Box>
						</Box>
						<Box>
							<Text color={buttonBorderColor} dimColor={dimButtonBorder}>
								{'─'.repeat(12)}
							</Text>
						</Box>
					</Box>
				</Box>
			</Box>

			{!error && helpText && isFocused && focusState === 'input' && (
				<Box marginLeft={labelWidth}>
					<Text dimColor={true} color="gray">
						{helpText}
					</Text>
				</Box>
			)}

			{isFocused && focusState === 'button' && (
				<Box marginLeft={labelWidth}>
					<Text dimColor={true} color="gray">
						Press Space to open selection list
					</Text>
				</Box>
			)}

			{error && (
				<Box marginLeft={labelWidth}>
					<Text color="red">{error}</Text>
				</Box>
			)}

			{!error && !(helpText && isFocused) && <Box marginBottom={1} />}
		</Box>
	);
};
