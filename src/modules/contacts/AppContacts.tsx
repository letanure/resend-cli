import { useState } from 'react';
import { ContactCreateForm } from './ContactCreateForm.js';
import { DeleteContactForm as ContactDeleteForm } from './delete/Form.js';
import { ContactListForm } from './ContactListForm.js';
import { ContactRetrieveForm } from './ContactRetrieveForm.js';
import { ContactsMenu, ContactsMenuState, type ContactsMenuState as ContactsMenuStateType } from './ContactsMenu.js';
import { ContactUpdateForm } from './ContactUpdateForm.js';

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
				<ContactCreateForm
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
				<ContactDeleteForm
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
