import { useState } from 'react';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Menu, MenuState } from './Menu.js';
import { Form as RetrieveForm } from './retrieve/Form.js';

interface AppProps {
	onExit: () => void;
}

export const App = ({ onExit }: AppProps) => {
	const [currentView, setCurrentView] = useState<MenuState | 'menu'>('menu');

	if (currentView === MenuState.create) {
		return <CreateForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === MenuState.retrieve) {
		return <RetrieveForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === MenuState.delete) {
		return <DeleteForm onExit={() => setCurrentView('menu')} />;
	}

	if (currentView === MenuState.list) {
		return <ListForm onExit={() => setCurrentView('menu')} />;
	}

	return <Menu onSelect={setCurrentView} onExit={onExit} />;
};
