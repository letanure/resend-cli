import { useState } from 'react';
import { EmailBatchForm } from './EmailBatchForm.js';
import { EmailCancelForm } from './EmailCancelForm.js';
import { EmailRetrieveForm } from './EmailRetrieveForm.js';
import { EmailSendForm } from './EmailSendForm.js';
import { EmailsMenu, type EmailsMenuState } from './EmailsMenu.js';
import { EmailUpdateForm } from './EmailUpdateForm.js';

type EmailsMenuStateWithMenu = 'menu' | EmailsMenuState;

interface AppEmailProps {
	onExit: () => void;
}
export const AppEmail = ({ onExit }: AppEmailProps) => {
	const [screenState, setScreenState] = useState<EmailsMenuStateWithMenu>('menu');

	const handleMenuSelect = (menuId: EmailsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && <EmailsMenu onSelect={handleMenuSelect} onExit={() => onExit()} />}
			{screenState === 'send' && <EmailSendForm onExit={() => setScreenState('menu')} />}
			{screenState === 'batch' && <EmailBatchForm onExit={() => setScreenState('menu')} />}
			{screenState === 'retrieve' && <EmailRetrieveForm onExit={() => setScreenState('menu')} />}
			{screenState === 'update' && <EmailUpdateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'cancel' && <EmailCancelForm onExit={() => setScreenState('menu')} />}
		</>
	);
};
