import { useState } from 'react';
import { BroadcastCreateForm } from './BroadcastCreateForm.js';
import { BroadcastDeleteForm } from './BroadcastDeleteForm.js';
import { BroadcastListForm } from './BroadcastListForm.js';
import { BroadcastRetrieveForm } from './BroadcastRetrieveForm.js';
import { BroadcastSendForm } from './BroadcastSendForm.js';
import { BroadcastsMenu, type BroadcastsMenuState } from './BroadcastsMenu.js';
import { BroadcastUpdateForm } from './BroadcastUpdateForm.js';

type BroadcastsMenuStateWithMenu = 'menu' | BroadcastsMenuState;

interface AppBroadcastsProps {
	onExit: () => void;
}

export const AppBroadcasts = ({ onExit }: AppBroadcastsProps) => {
	const [screenState, setScreenState] = useState<BroadcastsMenuStateWithMenu>('menu');

	const handleMenuSelect = (menuId: BroadcastsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && <BroadcastsMenu onSelect={handleMenuSelect} onExit={() => onExit()} />}
			{screenState === 'create' && <BroadcastCreateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'retrieve' && <BroadcastRetrieveForm onExit={() => setScreenState('menu')} />}
			{screenState === 'update' && <BroadcastUpdateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'send' && <BroadcastSendForm onExit={() => setScreenState('menu')} />}
			{screenState === 'delete' && <BroadcastDeleteForm onExit={() => setScreenState('menu')} />}
			{screenState === 'list' && <BroadcastListForm onExit={() => setScreenState('menu')} />}
		</>
	);
};
