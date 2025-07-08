import { useState } from 'react';
import {
	BroadcastsMenu,
	BroadcastsMenuState,
	type BroadcastsMenuState as BroadcastsMenuStateType,
} from './BroadcastsMenu.js';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as SendForm } from './send/Form.js';
import { Form as UpdateForm } from './update/Form.js';

type BroadcastsMenuStateWithMenu = 'menu' | BroadcastsMenuStateType;

interface AppBroadcastsProps {
	onExit: () => void;
}

export const AppBroadcasts = ({ onExit }: AppBroadcastsProps) => {
	const [screenState, setScreenState] = useState<BroadcastsMenuStateWithMenu>('menu');
	const [lastSelectedBroadcastMenuItem, setLastSelectedBroadcastMenuItem] = useState<BroadcastsMenuStateType>();

	const handleMenuSelect = (menuId: BroadcastsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<BroadcastsMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedBroadcastMenuItem}
				/>
			)}
			{screenState === 'create' && (
				<CreateForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'send' && (
				<SendForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.send);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
