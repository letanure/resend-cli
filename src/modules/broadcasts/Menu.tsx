import { Layout } from '@/components/ui/layout.js';
import { type MenuItem, Menu as UIMenu } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum MenuState {
	create = 'create',
	retrieve = 'retrieve',
	update = 'update',
	send = 'send',
	delete = 'delete',
	list = 'list',
}

const BROADCASTS_MENU_ITEMS: Array<MenuItem<MenuState>> = [
	{
		id: MenuState.create,
		label: 'Create',
		description: 'Create a new broadcast to send to your audience.',
	},
	{
		id: MenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single broadcast..',
	},
	{
		id: MenuState.update,
		label: 'Update',
		description: 'Update a broadcast to send to your audience.',
	},
	{
		id: MenuState.send,
		label: 'Send',
		description: 'Start sending broadcasts to your audience through the Resend API.',
	},
	{
		id: MenuState.delete,
		label: 'Delete',
		description: 'Remove an existing broadcast.',
	},
	{
		id: MenuState.list,
		label: 'List',
		description: 'Retrieve a list of broadcast.',
	},
];

interface MenuProps {
	onExit: () => void;
	onSelect: (menuId: MenuState) => void;
	initialSelectedKey?: MenuState;
}

export const Menu = ({ onExit, onSelect, initialSelectedKey }: MenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts`} showNavigationInstructions={true}>
			<UIMenu
				menuItems={BROADCASTS_MENU_ITEMS}
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
