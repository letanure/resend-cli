import { useState } from 'react';
import { ContactsMenu, ContactsMenuState, type ContactsMenuState as ContactsMenuStateType } from './ContactsMenu.js';
import { CreateContactForm } from './create/Form.js';
import { DeleteContactForm } from './delete/Form.js';
import { ContactListForm } from './list/Form.js';
import { ContactRetrieveForm } from './retrieve/Form.js';
import { ContactUpdateForm } from './update/Form.js';

type ContactsMenuStateWithMenu = 'menu' | ContactsMenuStateType;

interface AppContactsProps {
	onExit: () => void;
}

export const AppContacts = ({ onExit }: AppContactsProps) => {
	const [screenState, setScreenState] = useState<ContactsMenuStateWithMenu>('menu');
	const [lastSelectedContactMenuItem, setLastSelectedContactMenuItem] = useState<ContactsMenuStateType>();

	const handleMenuSelect = (menuId: ContactsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<ContactsMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedContactMenuItem}
				/>
			)}
			{screenState === 'create' && (
				<CreateContactForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<ContactRetrieveForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<ContactUpdateForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteContactForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ContactListForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
