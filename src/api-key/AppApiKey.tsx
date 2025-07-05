import { useState } from 'react';
import { ApiKeyCreateForm } from './ApiKeyCreateForm.js';
import { ApiKeyDeleteForm } from './ApiKeyDeleteForm.js';
import { ApiKeyListForm } from './ApiKeyListForm.js';
import { ApiKeysMenu, type ApiKeysMenuState } from './ApiKeysMenu.js';

type ApiKeysMenuStateWithMenu = 'menu' | ApiKeysMenuState;

interface AppApiKeyProps {
	onExit: () => void;
}

export const AppApiKey = ({ onExit }: AppApiKeyProps) => {
	const [screenState, setScreenState] = useState<ApiKeysMenuStateWithMenu>('menu');

	const handleMenuSelect = (menuId: ApiKeysMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && <ApiKeysMenu onSelect={handleMenuSelect} onExit={() => onExit()} />}
			{screenState === 'create' && <ApiKeyCreateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'list' && <ApiKeyListForm onExit={() => setScreenState('menu')} />}
			{screenState === 'delete' && <ApiKeyDeleteForm onExit={() => setScreenState('menu')} />}
		</>
	);
};