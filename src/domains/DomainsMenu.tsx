import { Menu, type MenuItem } from '../components/ui/Menu.js';

export enum DomainsMenuState {
	create = 'create',
	retrieve = 'retrieve',
	verify = 'verify',
	update = 'update',
	list = 'list',
	delete = 'delete',
}

const DOMAINS_MENU_ITEMS: Array<MenuItem<DomainsMenuState>> = [
	{
		id: DomainsMenuState.create,
		label: 'Create',
		description: 'Create a domain through the Resend Email API.',
	},
	{
		id: DomainsMenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single domain for the authenticated user.',
	},
	{
		id: DomainsMenuState.verify,
		label: 'Verify',
		description: 'Verify an existing domain.',
	},
	{
		id: DomainsMenuState.update,
		label: 'Update',
		description: 'Update an existing domain.',
	},
	{
		id: DomainsMenuState.list,
		label: 'List',
		description: 'Retrieve a list of domains for the authenticated user.',
	},
	{
		id: DomainsMenuState.delete,
		label: 'Delete',
		description: 'Remove an existing domain.',
	},
];

interface DomainsMenuProps {
	onExit: () => void;
	onSelect: (menuId: DomainsMenuState) => void;
}

export const DomainsMenu = ({ onExit, onSelect }: DomainsMenuProps) => {
	return (
		<Menu
			menuItems={DOMAINS_MENU_ITEMS}
			title="🌍 Resend CLI - Domains Menu"
			onSelect={(menuId) => {
				onSelect(menuId);
			}}
			onExit={() => {
				onExit();
			}}
		/>
	);
};
