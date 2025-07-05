import { Layout } from '../components/ui/layout.js';
import { Menu, type MenuItem } from '../components/ui/Menu.js';
import { config } from '../config.js';
import { AppState } from '../types.js';

interface MainMenuProps {
	onSelect: (menuId: AppState) => void;
	onExit: () => void;
}

const MENU_ITEMS: Array<MenuItem<AppState>> = [
	{
		id: AppState.email,
		label: 'Email',
		description: 'Send, retrieve, update, and cancel emails',
	},
	{
		id: AppState.domains,
		label: 'Domains',
		description: 'Create, verify, update, list, and delete domains',
	},
	{
		id: AppState.apiKeys,
		label: 'API Keys',
		description: 'Create, list, and delete API keys',
	},
	{
		id: AppState.broadcasts,
		label: 'Broadcasts',
		description: 'Create, list, and delete broadcasts',
	},
	{
		id: AppState.audiences,
		label: 'Audiences',
		description: 'Create, list, and delete audiences',
	},
	{
		id: AppState.contacts,
		label: 'Contacts',
		description: 'Add, list, and delete contacts',
	},
];

export const MainMenu = ({ onSelect, onExit }: MainMenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle}`} showNavigationInstructions={true}>
			<Menu
				menuItems={MENU_ITEMS}
				onSelect={(menuId) => {
					onSelect(menuId);
				}}
				onExit={onExit}
			/>
		</Layout>
	);
};
