import { Box, Text, useInput } from 'ink';
import { useState } from 'react';

export interface MenuItem<T extends string> {
	id: T;
	label: string;
	description: string;
	disabled?: boolean;
}

interface MainMenuProps<T extends string> {
	menuItems: Array<MenuItem<T>>;
	onSelect: (menuId: T) => void;
	onExit: (lastSelectedKey?: T) => void;
	title?: string;
	initialSelectedKey?: T;
}

export const Menu = <T extends string>({ menuItems, onSelect, onExit, initialSelectedKey }: MainMenuProps<T>) => {
	const initialIndex = initialSelectedKey ? menuItems.findIndex((item) => item.id === initialSelectedKey) : 0;
	const [selectedIndex, setSelectedIndex] = useState(Math.max(0, initialIndex));

	useInput((input, key) => {
		if (key.upArrow && selectedIndex > 0) {
			setSelectedIndex(selectedIndex - 1);
		}

		if (key.downArrow && selectedIndex < menuItems.length - 1) {
			setSelectedIndex(selectedIndex + 1);
		}

		if (key.return) {
			const selectedItem = menuItems[selectedIndex];
			if (selectedItem && !selectedItem.disabled) {
				onSelect(selectedItem.id);
			}
		}

		if (input === 'q' || key.escape) {
			const currentSelectedItem = menuItems[selectedIndex];
			onExit(currentSelectedItem?.id);
		}
	});

	return (
		<Box flexDirection="column">
			{menuItems.map((item, index) => (
				<Box key={item.id} marginBottom={1}>
					<Box width={3}>
						<Text color={index === selectedIndex ? 'cyan' : 'gray'}>{index === selectedIndex ? '▶' : ' '}</Text>
					</Box>
					<Box flexDirection="column">
						<Text 
							color={item.disabled ? 'gray' : (index === selectedIndex ? 'cyan' : 'white')} 
							bold={index === selectedIndex && !item.disabled}
							dimColor={item.disabled}
						>
							{item.label}
						</Text>
						<Text 
							color={item.disabled ? 'gray' : (index === selectedIndex ? 'gray' : 'darkGray')} 
							dimColor={item.disabled || index !== selectedIndex}
						>
							{item.description}
						</Text>
					</Box>
				</Box>
			))}
		</Box>
	);
};
