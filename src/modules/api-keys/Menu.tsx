import { Layout } from '@/components/ui/layout.js';
import { type MenuItem, Menu as UIMenu } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum MenuState {
	create = 'create',
	list = 'list',
	delete = 'delete',
}

const MAIN_MENU_ITEMS: Array<MenuItem<MenuState>> = [
	{
		id: MenuState.create,
		label: 'Create',
		description: 'Create a new API key in Resend.',
	},
	{
		id: MenuState.list,
		label: 'List',
		description: 'List all API keys in Resend.',
	},
	{
		id: MenuState.delete,
		label: 'Delete',
		description: 'Delete an existing API key from Resend.',
	},
];

interface MenuProps {
	onExit: () => void;
	onSelect: (menuId: MenuState) => void;
	initialSelectedKey?: MenuState;
}

export const Menu = ({ onExit, onSelect, initialSelectedKey }: MenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - API Keys`} showNavigationInstructions={true}>
			<UIMenu
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
