import { useState } from 'react';
import { ContactCreateForm } from './ContactCreateForm.js';
import { ContactDeleteForm } from './ContactDeleteForm.js';
import { ContactListForm } from './ContactListForm.js';
import { ContactRetrieveForm } from './ContactRetrieveForm.js';
import { ContactsMenu, type ContactsMenuState } from './ContactsMenu.js';
import { ContactUpdateForm } from './ContactUpdateForm.js';

type ContactsMenuStateWithMenu = 'menu' | ContactsMenuState;

interface AppContactsProps {
	onExit: () => void;
}

export const AppContacts = ({ onExit }: AppContactsProps) => {
	const [screenState, setScreenState] = useState<ContactsMenuStateWithMenu>('menu');

	const handleMenuSelect = (menuId: ContactsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && <ContactsMenu onSelect={handleMenuSelect} onExit={() => onExit()} />}
			{screenState === 'create' && <ContactCreateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'retrieve' && <ContactRetrieveForm onExit={() => setScreenState('menu')} />}
			{screenState === 'update' && <ContactUpdateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'delete' && <ContactDeleteForm onExit={() => setScreenState('menu')} />}
			{screenState === 'list' && <ContactListForm onExit={() => setScreenState('menu')} />}
		</>
	);
};
