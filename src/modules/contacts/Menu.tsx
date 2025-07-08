import { Layout } from '@/components/ui/layout.js';
import { type MenuItem, Menu as UIMenu } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum MenuState {
	create = 'create',
	retrieve = 'retrieve',
	update = 'update',
	delete = 'delete',
	list = 'list',
}

const CONTACTS_MENU_ITEMS: Array<MenuItem<MenuState>> = [
	{
		id: MenuState.create,
		label: 'Create',
		description: 'Create a contact inside an audience.',
	},
	{
		id: MenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single contact from an audience.',
	},
	{
		id: MenuState.update,
		label: 'Update',
		description: 'Update an existing contact.',
	},
	{
		id: MenuState.delete,
		label: 'Delete',
		description: 'Remove an existing contact from an audience.',
	},
	{
		id: MenuState.list,
		label: 'List',
		description: 'Show all contacts from an audience.',
	},
];

interface MenuProps {
	onExit: () => void;
	onSelect: (menuId: MenuState) => void;
	initialSelectedKey?: MenuState;
}

export const Menu = ({ onExit, onSelect, initialSelectedKey }: MenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - Contacts`} showNavigationInstructions={true}>
			<UIMenu
				menuItems={CONTACTS_MENU_ITEMS}
				onSelect={(menuId) => {
					onSelect(menuId);
				}}
				onExit={() => {
					onExit();
				}}
				initialSelectedKey={initialSelectedKey}
			/>
		</Layout>
	);
};
