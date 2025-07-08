import { Layout } from '@/components/ui/layout.js';
import { Menu, type MenuItem } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum ApiKeysMenuState {
	create = 'create',
}

const MAIN_MENU_ITEMS: Array<MenuItem<ApiKeysMenuState>> = [
	{
		id: ApiKeysMenuState.create,
		label: 'Create',
		description: 'Create a new API key in Resend.',
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
				menuItems={MAIN_MENU_ITEMS}
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
