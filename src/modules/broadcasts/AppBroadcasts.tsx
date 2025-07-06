import { useState } from 'react';
import { BroadcastCreateForm } from './BroadcastCreateForm.js';
import { BroadcastDeleteForm } from './BroadcastDeleteForm.js';
import { BroadcastListForm } from './BroadcastListForm.js';
import { BroadcastRetrieveForm } from './BroadcastRetrieveForm.js';
import { BroadcastSendForm } from './BroadcastSendForm.js';
import {
	BroadcastsMenu,
	BroadcastsMenuState,
	type BroadcastsMenuState as BroadcastsMenuStateType,
} from './BroadcastsMenu.js';
import { BroadcastUpdateForm } from './BroadcastUpdateForm.js';

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
				<BroadcastCreateForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<BroadcastRetrieveForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<BroadcastUpdateForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'send' && (
				<BroadcastSendForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.send);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<BroadcastDeleteForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<BroadcastListForm
					onExit={() => {
						setLastSelectedBroadcastMenuItem(BroadcastsMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
