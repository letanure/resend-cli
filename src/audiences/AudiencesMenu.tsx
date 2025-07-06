import { Layout } from '@/components/ui/layout.js';
import { Menu, type MenuItem } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

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
	onSelect: (menuId: AudiencesMenuState) => void;
	initialSelectedKey?: AudiencesMenuState;
}

export const AudiencesMenu = ({ onExit, onSelect, initialSelectedKey }: AudiencesMenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - Audiences`} showNavigationInstructions={true}>
			<Menu
				menuItems={AUDIENCES_MENU_ITEMS}
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
