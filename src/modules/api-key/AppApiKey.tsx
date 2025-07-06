import { useState } from 'react';
import { ApiKeyCreateForm } from './ApiKeyCreateForm.js';
import { ApiKeyDeleteForm } from './ApiKeyDeleteForm.js';
import { ApiKeyListForm } from './ApiKeyListForm.js';
import { ApiKeysMenu, ApiKeysMenuState, type ApiKeysMenuState as ApiKeysMenuStateType } from './ApiKeysMenu.js';

type ApiKeysMenuStateWithMenu = 'menu' | ApiKeysMenuStateType;

interface AppApiKeyProps {
	onExit: () => void;
}

export const AppApiKey = ({ onExit }: AppApiKeyProps) => {
	const [screenState, setScreenState] = useState<ApiKeysMenuStateWithMenu>('menu');
	const [lastSelectedApiKeyMenuItem, setLastSelectedApiKeyMenuItem] = useState<ApiKeysMenuStateType>();

	const handleMenuSelect = (menuId: ApiKeysMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<ApiKeysMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedApiKeyMenuItem}
				/>
			)}
			{screenState === 'create' && (
				<ApiKeyCreateForm
					onExit={() => {
						setLastSelectedApiKeyMenuItem(ApiKeysMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ApiKeyListForm
					onExit={() => {
						setLastSelectedApiKeyMenuItem(ApiKeysMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<ApiKeyDeleteForm
					onExit={() => {
						setLastSelectedApiKeyMenuItem(ApiKeysMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
