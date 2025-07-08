import { useState } from 'react';
import { Form as BatchForm } from './batch/Form.js';
import { Form as CancelForm } from './cancel/Form.js';
import { EmailsMenu, EmailsMenuState, type EmailsMenuState as EmailsMenuStateType } from './EmailsMenu.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as SendForm } from './send/Form.js';
import { Form as UpdateForm } from './update/Form.js';

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
				<SendForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.send);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'batch' && (
				<BatchForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.batch);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'cancel' && (
				<CancelForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.cancel);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
