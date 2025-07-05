import { Menu, type MenuItem } from '../components/ui/Menu.js';

export enum EmailsMenuState {
	send = 'send',
	batch = 'batch',
	retrieve = 'retrieve',
	update = 'update',
	cancel = 'cancel',
}

const MAIN_MENU_ITEMS: Array<MenuItem<EmailsMenuState>> = [
	{
		id: EmailsMenuState.send,
		label: 'Send',
		description: 'Start sending emails through the Resend Email API.',
	},
	{
		id: EmailsMenuState.batch,
		label: 'Batch',
		description: 'Trigger up to 100 batch emails at once.',
	},
	{
		id: EmailsMenuState.retrieve,
		label: 'Retrieve',
		description: 'Retrieve a single email.',
	},
	{
		id: EmailsMenuState.update,
		label: 'Update',
		description: 'Update a scheduled email.',
	},
	{
		id: EmailsMenuState.cancel,
		label: 'Cancel',
		description: 'Cancel a scheduled email.',
	},
];

interface EmailsMenuProps {
	onExit: () => void;
}

export const EmailsMenu = ({ onExit }: EmailsMenuProps) => {
	const handleMenuSelect = (menuId: EmailsMenuState) => {
		console.log(`Selected menu: ${menuId}`);
	};

	return (
		<Menu
			menuItems={MAIN_MENU_ITEMS}
			title="📧 Resend CLI - Emails Menu"
			onSelect={(menuId) => {
				handleMenuSelect(menuId);
			}}
			onExit={() => {
				onExit();
			}}
		/>
	);
};
