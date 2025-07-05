import { Menu, type MenuItem } from '../components/ui/Menu.js';

export enum AudiencesMenuState {
	create = 'create',
	retrieve = 'retrieve',
	delete = 'delete',
	liest = 'list',
}

const AUDIENCES_MENU_ITEMS: Array<MenuItem<AudiencesMenuState>> = [
	{
		id: AudiencesMenuState.create,
		label: 'Create',
		description: 'Create a list of contacts.',
	},
	{
		id: AudiencesMenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single audience.',
	},
	{
		id: AudiencesMenuState.delete,
		label: 'Delete',
		description: 'Remove an existing audience..',
	},
	{
		id: AudiencesMenuState.liest,
		label: 'List',
		description: 'Retrieve a list of audiences..',
	},
];

interface AudiencesMenuProps {
	onExit: () => void;
}

export const AudiencesMenu = ({ onExit }: AudiencesMenuProps) => {
	const handleMenuSelect = (menuId: AudiencesMenuState) => {
		console.log(`Selected menu: ${menuId}`);
	};

	return (
		<Menu
			menuItems={AUDIENCES_MENU_ITEMS}
			title="📧 Resend CLI - Audiences Menu"
			onSelect={(menuId) => {
				handleMenuSelect(menuId);
			}}
			onExit={() => {
				onExit();
			}}
		/>
	);
};
