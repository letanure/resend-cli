import { useState } from 'react';
import { ApiKeysMenu, ApiKeysMenuState } from './ApiKeysMenu.js';
import { CreateApiKeyForm } from './create/Form.js';
import { DeleteApiKeyForm } from './delete/Form.js';
import { ListApiKeyForm } from './list/Form.js';

interface AppApiKeyProps {
	onExit: () => void;
}

export const AppApiKey = ({ onExit }: AppApiKeyProps) => {
	const [currentView, setCurrentView] = useState<ApiKeysMenuState | 'menu'>('menu');

	if (currentView === ApiKeysMenuState.create) {
		return <CreateApiKeyForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === ApiKeysMenuState.list) {
		return <ListApiKeyForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === ApiKeysMenuState.delete) {
		return <DeleteApiKeyForm onExit={() => setCurrentView('menu')} />;
	}

	return <ApiKeysMenu onSelect={setCurrentView} onExit={onExit} />;
};
