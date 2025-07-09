import { useState } from 'react';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Menu, MenuState, type MenuState as MenuStateType } from './Menu.js';

type MenuStateWithMenu = 'menu' | MenuStateType;

interface AppProps {
	onExit: () => void;
}

export const App = ({ onExit }: AppProps) => {
	const [screenState, setScreenState] = useState<MenuStateWithMenu>('menu');
	const [lastSelectedApiKeyMenuItem, setLastSelectedApiKeyMenuItem] = useState<MenuStateType>();

	const handleMenuSelect = (menuId: MenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<Menu onSelect={handleMenuSelect} onExit={() => onExit()} initialSelectedKey={lastSelectedApiKeyMenuItem} />
			)}
			{screenState === 'create' && (
				<CreateForm
					onExit={() => {
						setLastSelectedApiKeyMenuItem(MenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedApiKeyMenuItem(MenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedApiKeyMenuItem(MenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
