import { useApp } from 'ink';
import { useState } from 'react';
import { AppApiKey } from '@/modules/api-key/AppApiKey.js';
import { AppAudiences } from '@/modules/audiences/AppAudiences.js';
import { AppBroadcasts } from '@/modules/broadcasts/AppBroadcasts.js';
import { AppContacts } from '@/modules/contacts/AppContacts.js';
import { AppDomains } from '@/modules/domains/AppDomains.js';
import { AppEmail } from '@/modules/emails/AppEmail.js';
import { MainMenu } from './components/MainMenu.js';
import { ResendProvider } from './contexts/ResendProvider.js';
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
