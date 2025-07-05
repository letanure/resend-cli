import { Menu, type MenuItem } from '../components/ui/Menu.js';

export enum ApiKeysMenuState {
	create = 'create',
	list = 'list',
	delete = 'delete',
}

const API_KEYS_MENU_ITEMS: Array<MenuItem<ApiKeysMenuState>> = [
	{
		id: ApiKeysMenuState.create,
		label: 'Create',
		description: 'Add a new API key to authenticate communications with Resend.',
	},
	{
		id: ApiKeysMenuState.list,
		label: 'List',
		description: 'Retrieve a list of API keys for the authenticated user.',
	},
	{
		id: ApiKeysMenuState.delete,
		label: 'Delete',
		description: 'Remove an existing API key.',
	},
];

interface ApiKeysMenuProps {
	onExit: () => void;
}

export const ApiKeysMenu = ({ onExit }: ApiKeysMenuProps) => {
	const handleMenuSelect = (menuId: ApiKeysMenuState) => {
		console.log(`Selected menu: ${menuId}`);
	};

	return (
		<Menu
			menuItems={API_KEYS_MENU_ITEMS}
			title="📧 Resend CLI - API Keys Menu"
			onSelect={(menuId) => {
				handleMenuSelect(menuId);
			}}
			onExit={() => {
				onExit();
			}}
		/>
	);
};
