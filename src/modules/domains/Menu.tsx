import { Layout } from '@/components/ui/layout.js';
import { type MenuItem, Menu as UIMenu } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum MenuState {
	create = 'create',
	retrieve = 'retrieve',
	verify = 'verify',
	update = 'update',
	list = 'list',
	delete = 'delete',
}

const DOMAINS_MENU_ITEMS: Array<MenuItem<MenuState>> = [
	{
		id: MenuState.create,
		label: 'Create',
		description: 'Create a domain through the Resend Email API.',
	},
	{
		id: MenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single domain for the authenticated user.',
	},
	{
		id: MenuState.verify,
		label: 'Verify',
		description: 'Verify an existing domain.',
	},
	{
		id: MenuState.update,
		label: 'Update',
		description: 'Update an existing domain.',
	},
	{
		id: MenuState.list,
		label: 'List',
		description: 'Retrieve a list of domains for the authenticated user.',
	},
	{
		id: MenuState.delete,
		label: 'Delete',
		description: 'Remove an existing domain.',
	},
];

interface MenuProps {
	onExit: () => void;
	onSelect: (menuId: MenuState) => void;
	initialSelectedKey?: MenuState;
}

export const Menu = ({ onExit, onSelect, initialSelectedKey }: MenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - Domains`} showNavigationInstructions={true}>
			<UIMenu
				menuItems={DOMAINS_MENU_ITEMS}
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
