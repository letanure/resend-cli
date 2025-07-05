import { Menu, type MenuItem } from '../components/ui/Menu.js';

export enum ContactsMenuState {
	create = 'create',
	retrieve = 'retrieve',
	update = 'update',
	delete = 'delete',
	list = 'list',
}

const CONTACTS_MENU_ITEMS: Array<MenuItem<ContactsMenuState>> = [
	{
		id: ContactsMenuState.create,
		label: 'Create',
		description: 'Create a contact inside an audience.',
	},
	{
		id: ContactsMenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single contact from an audience.',
	},
	{
		id: ContactsMenuState.update,
		label: 'Update',
		description: 'Update an existing contact.',
	},
	{
		id: ContactsMenuState.delete,
		label: 'Delete',
		description: 'Remove an existing contact from an audience.',
	},
	{
		id: ContactsMenuState.list,
		label: 'List',
		description: 'Show all contacts from an audience.',
	},
];

interface ContactsMenuProps {
	onExit: () => void;
}

export const ContactsMenu = ({ onExit }: ContactsMenuProps) => {
	const handleMenuSelect = (menuId: ContactsMenuState) => {
		console.log(`Selected menu: ${menuId}`);
	};

	return (
		<Menu
			menuItems={CONTACTS_MENU_ITEMS}
			title="📧 Resend CLI - Contacts Menu"
			onSelect={(menuId) => {
				handleMenuSelect(menuId);
			}}
			onExit={() => {
				onExit();
			}}
		/>
	);
};
