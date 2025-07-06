import { useApp } from 'ink';
import { useState } from 'react';
import { AppApiKey } from './api-key/AppApiKey.js';
import { AppAudiences } from './audiences/AppAudiences.js';
import { AppBroadcasts } from './broadcasts/AppBroadcasts.js';
import { MainMenu } from './components/MainMenu.js';
import { AppContacts } from './contacts/AppContacts.js';
import { ResendProvider } from './contexts/ResendProvider.js';
import { AppDomains } from './domains/AppDomains.js';
import { AppEmail } from './emails/AppEmail.js';
import { AppState } from './types.js';

export const AppMain = () => {
	const { exit } = useApp();
	const [screenState, setScreenState] = useState<AppState>(AppState.main);
	const [lastSelectedMainMenuItem, setLastSelectedMainMenuItem] = useState<AppState>();

	return (
		<ResendProvider>
			{screenState === AppState.main && (
				<MainMenu
					onSelect={(menuId) => setScreenState(menuId)}
					onExit={exit}
					initialSelectedKey={lastSelectedMainMenuItem}
				/>
			)}
			{screenState === AppState.email && (
				<AppEmail
					onExit={() => {
						setLastSelectedMainMenuItem(AppState.email);
						setScreenState(AppState.main);
					}}
				/>
			)}
			{screenState === AppState.domains && (
				<AppDomains
					onExit={() => {
						setLastSelectedMainMenuItem(AppState.domains);
						setScreenState(AppState.main);
					}}
				/>
			)}
			{screenState === AppState.apiKeys && (
				<AppApiKey
					onExit={() => {
						setLastSelectedMainMenuItem(AppState.apiKeys);
						setScreenState(AppState.main);
					}}
				/>
			)}
			{screenState === AppState.audiences && (
				<AppAudiences
					onExit={() => {
						setLastSelectedMainMenuItem(AppState.audiences);
						setScreenState(AppState.main);
					}}
				/>
			)}
			{screenState === AppState.broadcasts && (
				<AppBroadcasts
					onExit={() => {
						setLastSelectedMainMenuItem(AppState.broadcasts);
						setScreenState(AppState.main);
					}}
				/>
			)}
			{screenState === AppState.contacts && (
				<AppContacts
					onExit={() => {
						setLastSelectedMainMenuItem(AppState.contacts);
						setScreenState(AppState.main);
					}}
				/>
			)}
		</ResendProvider>
	);
};
