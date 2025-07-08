import { useState } from 'react';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Menu, MenuState, type MenuState as MenuStateType } from './Menu.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as UpdateForm } from './update/Form.js';
import { Form as VerifyForm } from './verify/Form.js';

type MenuStateWithMenu = 'menu' | MenuStateType;

interface AppProps {
	onExit: () => void;
}

export const App = ({ onExit }: AppProps) => {
	const [screenState, setScreenState] = useState<MenuStateWithMenu>('menu');
	const [lastSelectedDomainMenuItem, setLastSelectedDomainMenuItem] = useState<MenuStateType>();

	const handleMenuSelect = (menuId: MenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<Menu onSelect={handleMenuSelect} onExit={() => onExit()} initialSelectedKey={lastSelectedDomainMenuItem} />
			)}
			{screenState === 'create' && (
				<CreateForm
					onExit={() => {
						setLastSelectedDomainMenuItem(MenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedDomainMenuItem(MenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'verify' && (
				<VerifyForm
					onExit={() => {
						setLastSelectedDomainMenuItem(MenuState.verify);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedDomainMenuItem(MenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedDomainMenuItem(MenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedDomainMenuItem(MenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
