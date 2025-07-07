import { Layout } from '@/components/ui/layout.js';
import { Menu, type MenuItem } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';
import { Module } from '@/types/index.js';

interface MainMenuProps {
	onSelect: (menuId: Module) => void;
	onExit: () => void;
	initialSelectedKey?: Module;
}

const MENU_ITEMS: Array<MenuItem<Module>> = [
	{
		id: Module.email,
		label: 'Email',
		description: 'Send, retrieve, update, and cancel emails',
	},
	{
		id: Module.domains,
		label: 'Domains',
		description: 'Create, verify, update, list, and delete domains',
	},
	{
		id: Module.apiKeys,
		label: 'API Keys',
		description: 'Create, list, and delete API keys',
	},
	{
		id: Module.broadcasts,
		label: 'Broadcasts',
		description: 'Create, list, and delete broadcasts',
	},
	{
		id: Module.audiences,
		label: 'Audiences',
		description: 'Create, list, and delete audiences',
	},
	{
		id: Module.contacts,
		label: 'Contacts',
		description: 'Add, list, and delete contacts',
	},
];

export const MainMenu = ({ onSelect, onExit, initialSelectedKey }: MainMenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle}`} showNavigationInstructions={true}>
			<Menu
				menuItems={MENU_ITEMS}
				onSelect={(menuId) => {
					onSelect(menuId);
				}}
				onExit={() => onExit()}
				initialSelectedKey={initialSelectedKey}
			/>
		</Layout>
	);
};
