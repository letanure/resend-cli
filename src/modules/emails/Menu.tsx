import { Layout } from '@/components/ui/layout.js';
import { type MenuItem, Menu as UIMenu } from '@/components/ui/Menu.js';
import { config } from '@/config/config.js';

export enum MenuState {
	send = 'send',
	batch = 'batch',
	retrieve = 'retrieve',
	update = 'update',
	cancel = 'cancel',
}

const MAIN_MENU_ITEMS: Array<MenuItem<MenuState>> = [
	{
		id: MenuState.send,
		label: 'Send',
		description: 'Start sending emails through the Resend Email API.',
	},
	{
		id: MenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single email.',
	},
	{
		id: MenuState.update,
		label: 'Update',
		description: 'Update a scheduled email.',
	},
	{
		id: MenuState.cancel,
		label: 'Cancel',
		description: 'Cancel a scheduled email.',
	},
	{
		id: MenuState.batch,
		label: 'Batch',
		description: 'To be implemented - file-based batch email operations.',
		disabled: true,
	},
];

interface MenuProps {
	onExit: () => void;
	onSelect: (menuId: MenuState) => void;
	initialSelectedKey?: MenuState;
}

export const Menu = ({ onExit, onSelect, initialSelectedKey }: MenuProps) => {
	return (
		<Layout headerText={`${config.baseTitle} - Emails`} showNavigationInstructions={true} navigationContext="menu">
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
