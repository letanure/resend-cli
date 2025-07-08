import { useState } from 'react';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Menu, MenuState, type MenuState as MenuStateType } from './Menu.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as SendForm } from './send/Form.js';
import { Form as UpdateForm } from './update/Form.js';

type MenuStateWithMenu = 'menu' | MenuStateType;

interface AppProps {
	onExit: () => void;
}

export const App = ({ onExit }: AppProps) => {
	const [screenState, setScreenState] = useState<MenuStateWithMenu>('menu');
	const [lastSelectedBroadcastMenuItem, setLastSelectedBroadcastMenuItem] = useState<MenuStateType>();

	const handleMenuSelect = (menuId: MenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<Menu onSelect={handleMenuSelect} onExit={() => onExit()} initialSelectedKey={lastSelectedBroadcastMenuItem} />
			)}
			{screenState === 'create' && (
				<CreateForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(MenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(MenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(MenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'send' && (
				<SendForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(MenuState.send);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(MenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(MenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
