import { useState } from 'react';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Menu, MenuState, type MenuState as MenuStateType } from './Menu.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as UpdateForm } from './update/Form.js';

type MenuStateWithMenu = 'menu' | MenuStateType;

interface AppProps {
	onExit: () => void;
}

export const App = ({ onExit }: AppProps) => {
	const [screenState, setScreenState] = useState<MenuStateWithMenu>('menu');
	const [lastSelectedContactMenuItem, setLastSelectedContactMenuItem] = useState<MenuStateType>();

	const handleMenuSelect = (menuId: MenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<Menu onSelect={handleMenuSelect} onExit={() => onExit()} initialSelectedKey={lastSelectedContactMenuItem} />
			)}
			{screenState === 'create' && (
				<CreateForm
					onExit={() => {
						setLastSelectedContactMenuItem(MenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedContactMenuItem(MenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedContactMenuItem(MenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedContactMenuItem(MenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedContactMenuItem(MenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
