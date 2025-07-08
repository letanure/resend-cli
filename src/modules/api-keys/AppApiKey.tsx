import { useState } from 'react';
import { ApiKeysMenu, ApiKeysMenuState } from './ApiKeysMenu.js';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';

interface AppApiKeyProps {
	onExit: () => void;
}

export const AppApiKey = ({ onExit }: AppApiKeyProps) => {
	const [currentView, setCurrentView] = useState<ApiKeysMenuState | 'menu'>('menu');

	if (currentView === ApiKeysMenuState.create) {
		return <CreateForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === ApiKeysMenuState.list) {
		return <ListForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === ApiKeysMenuState.delete) {
		return <DeleteForm onExit={() => setCurrentView('menu')} />;
	}

	return <ApiKeysMenu onSelect={setCurrentView} onExit={onExit} />;
};
