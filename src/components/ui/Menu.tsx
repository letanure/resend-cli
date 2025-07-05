import { Box, Text, useInput } from 'ink';
import { useState } from 'react';

export interface MenuItem<T extends string> {
	id: T;
	label: string;
	description: string;
}

interface MainMenuProps<T extends string> {
	menuItems: Array<MenuItem<T>>;
	onSelect: (menuId: T) => void;
	onExit: () => void;
	title?: string;
}

export const Menu = <T extends string>({ menuItems, onSelect, onExit }: MainMenuProps<T>) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	useInput((input, key) => {
		if (key.upArrow && selectedIndex > 0) {
			setSelectedIndex(selectedIndex - 1);
		}

		if (key.downArrow && selectedIndex < menuItems.length - 1) {
			setSelectedIndex(selectedIndex + 1);
		}

		if (key.return) {
			const selectedItem = menuItems[selectedIndex];
			if (selectedItem) {
				onSelect(selectedItem.id);
			}
		}

		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			{menuItems.map((item, index) => (
				<Box key={item.id} marginBottom={1}>
					<Box width={3}>
						<Text color={index === selectedIndex ? 'cyan' : 'gray'}>{index === selectedIndex ? '▶' : ' '}</Text>
					</Box>
					<Box flexDirection="column">
						<Text color={index === selectedIndex ? 'cyan' : 'white'} bold={index === selectedIndex}>
							{item.label}
						</Text>
						<Text color={index === selectedIndex ? 'gray' : 'darkGray'} dimColor={index !== selectedIndex}>
							{item.description}
						</Text>
					</Box>
				</Box>
			))}
		</Box>
	);
};
