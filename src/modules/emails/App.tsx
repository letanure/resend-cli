import { useState } from 'react';
import { Form as BatchForm } from './batch/Form.js';
import { Form as CancelForm } from './cancel/Form.js';
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
	const [lastSelectedEmailMenuItem, setLastSelectedEmailMenuItem] = useState<MenuStateType>();

	const handleMenuSelect = (menuId: MenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<Menu onSelect={handleMenuSelect} onExit={() => onExit()} initialSelectedKey={lastSelectedEmailMenuItem} />
			)}
			{screenState === 'send' && (
				<SendForm
					onExit={() => {
						setLastSelectedEmailMenuItem(MenuState.send);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'batch' && (
				<BatchForm
					onExit={() => {
						setLastSelectedEmailMenuItem(MenuState.batch);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedEmailMenuItem(MenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedEmailMenuItem(MenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'cancel' && (
				<CancelForm
					onExit={() => {
						setLastSelectedEmailMenuItem(MenuState.cancel);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
