import { useState } from 'react';
import { EmailCancelForm } from './cancel/Form.js';
import { EmailBatchForm } from './EmailBatchForm.js';
import { EmailsMenu, EmailsMenuState, type EmailsMenuState as EmailsMenuStateType } from './EmailsMenu.js';
import { EmailRetrieveForm } from './retrieve/Form.js';
import { Form as FormEmail } from './send/Form.js';
import { EmailUpdateForm } from './update/Form.js';

type EmailsMenuStateWithMenu = 'menu' | EmailsMenuStateType;

interface AppEmailProps {
	onExit: () => void;
}

export const AppEmail = ({ onExit }: AppEmailProps) => {
	const [screenState, setScreenState] = useState<EmailsMenuStateWithMenu>('menu');
	const [lastSelectedEmailMenuItem, setLastSelectedEmailMenuItem] = useState<EmailsMenuStateType>();

	const handleMenuSelect = (menuId: EmailsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<EmailsMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedEmailMenuItem}
				/>
			)}
			{screenState === 'send' && (
				<FormEmail
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.send);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'batch' && (
				<EmailBatchForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.batch);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<EmailRetrieveForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<EmailUpdateForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'cancel' && (
				<EmailCancelForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.cancel);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
