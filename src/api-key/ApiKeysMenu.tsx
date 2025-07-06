import { Layout } from '../components/ui/layout.js';
import { Menu, type MenuItem } from '../components/ui/Menu.js';
import { config } from '../config.js';

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
	onSelect: (menuId: ApiKeysMenuState) => void;
	initialSelectedKey?: ApiKeysMenuState;
}

export const ApiKeysMenu = ({ onExit, onSelect, initialSelectedKey }: ApiKeysMenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - API Keys`} showNavigationInstructions={true}>
			<Menu
				menuItems={API_KEYS_MENU_ITEMS}
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
