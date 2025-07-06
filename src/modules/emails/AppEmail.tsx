import { useState } from 'react';
import { ResultScreen, type ResultType } from '@/components/ui/ResultScreen.js';
import { config } from '@/config/config.js';
import { EmailBatchForm } from './EmailBatchForm.js';
import { EmailCancelForm } from './EmailCancelForm.js';
import { EmailRetrieveForm } from './EmailRetrieveForm.js';
import { EmailsMenu, EmailsMenuState, type EmailsMenuState as EmailsMenuStateType } from './EmailsMenu.js';
import { EmailUpdateForm } from './EmailUpdateForm.js';
import { Form as FormEmail } from './send/Form.js';

type EmailsMenuStateWithMenu = 'menu' | EmailsMenuStateType;

interface AppEmailProps {
	onExit: () => void;
}
interface ResultState {
	type: ResultType;
	message: string;
}

export const AppEmail = ({ onExit }: AppEmailProps) => {
	const [screenState, setScreenState] = useState<EmailsMenuStateWithMenu>('menu');
	const [lastSelectedEmailMenuItem, setLastSelectedEmailMenuItem] = useState<EmailsMenuStateType>();
	const [result, setResult] = useState<ResultState | null>(null);

	const handleMenuSelect = (menuId: EmailsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	const handleEmailSent = (emailId: string) => {
		setResult({
			type: 'success',
			message: `Email sent successfully! ID: ${emailId}`,
		});
		setLastSelectedEmailMenuItem(EmailsMenuState.send);
		setScreenState('menu');
	};

	const handleEmailError = (error: string) => {
		setResult({
			type: 'error',
			message: error,
		});
		setLastSelectedEmailMenuItem(EmailsMenuState.send);
		setScreenState('menu');
	};

	const clearResult = () => {
		setResult(null);
	};

	return (
		<>
			{result ? (
				<ResultScreen
					type={result.type}
					message={result.message}
					onContinue={clearResult}
					headerText={`${config.baseTitle} - Emails - Send`}
				/>
			) : screenState === 'menu' ? (
				<EmailsMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedEmailMenuItem}
				/>
			) : null}
			{!result && screenState === 'send' && (
				<FormEmail
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.send);
						setScreenState('menu');
					}}
					onEmailSent={handleEmailSent}
					onEmailError={handleEmailError}
				/>
			)}
			{!result && screenState === 'batch' && (
				<EmailBatchForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.batch);
						setScreenState('menu');
					}}
				/>
			)}
			{!result && screenState === 'retrieve' && (
				<EmailRetrieveForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{!result && screenState === 'update' && (
				<EmailUpdateForm
					onExit={() => {
						setLastSelectedEmailMenuItem(EmailsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{!result && screenState === 'cancel' && (
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
