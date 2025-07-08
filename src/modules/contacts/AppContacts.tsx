import { useState } from 'react';
import { ContactsMenu, ContactsMenuState, type ContactsMenuState as ContactsMenuStateType } from './ContactsMenu.js';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as UpdateForm } from './update/Form.js';

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
				<CreateForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedContactMenuItem(ContactsMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
