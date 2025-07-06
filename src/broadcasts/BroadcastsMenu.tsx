import { Layout } from '@/components/ui/layout.js';
import { Menu, type MenuItem } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum BroadcastsMenuState {
	create = 'create',
	retrieve = 'retrieve',
	update = 'update',
	send = 'send',
	delete = 'delete',
	list = 'list',
}

const BROADCASTS_MENU_ITEMS: Array<MenuItem<BroadcastsMenuState>> = [
	{
		id: BroadcastsMenuState.create,
		label: 'Create',
		description: 'Create a new broadcast to send to your audience.',
	},
	{
		id: BroadcastsMenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single broadcast..',
	},
	{
		id: BroadcastsMenuState.update,
		label: 'Update',
		description: 'Update a broadcast to send to your audience.',
	},
	{
		id: BroadcastsMenuState.send,
		label: 'Send',
		description: 'Start sending broadcasts to your audience through the Resend API.',
	},
	{
		id: BroadcastsMenuState.delete,
		label: 'Delete',
		description: 'Remove an existing broadcast.',
	},
	{
		id: BroadcastsMenuState.list,
		label: 'List',
		description: 'Retrieve a list of broadcast.',
	},
];

interface BroadcastsMenuProps {
	onExit: () => void;
	onSelect: (menuId: BroadcastsMenuState) => void;
	initialSelectedKey?: BroadcastsMenuState;
}

export const BroadcastsMenu = ({ onExit, onSelect, initialSelectedKey }: BroadcastsMenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts`} showNavigationInstructions={true}>
			<Menu
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
