import { useApp } from 'ink';
import { useState } from 'react';
import { AppApiKey } from '@/modules/api-keys/AppApiKey.js';
import { AppAudiences } from '@/modules/audiences/AppAudiences.js';
import { AppBroadcasts } from '@/modules/broadcasts/AppBroadcasts.js';
import { AppContacts } from '@/modules/contacts/AppContacts.js';
import { AppDomains } from '@/modules/domains/AppDomains.js';
import { AppEmail } from '@/modules/emails/AppEmail.js';
import { Module } from '@/types/index.js';
import { MainMenu } from './components/MainMenu.js';
import { DryRunProvider } from './contexts/DryRunProvider.js';
import { ResendProvider } from './contexts/ResendProvider.js';

interface AppMainProps {
	isDryRun?: boolean;
}

export const AppMain = ({ isDryRun = false }: AppMainProps) => {
	const { exit } = useApp();
	const [screenState, setScreenState] = useState<Module>(Module.main);
	const [lastSelectedMainMenuItem, setLastSelectedMainMenuItem] = useState<Module>();

	return (
		<DryRunProvider isDryRun={isDryRun}>
			<ResendProvider>
				{screenState === Module.main && (
					<MainMenu
						onSelect={(menuId) => setScreenState(menuId)}
						onExit={exit}
						initialSelectedKey={lastSelectedMainMenuItem}
					/>
				)}
				{screenState === Module.email && (
					<AppEmail
						onExit={() => {
							setLastSelectedMainMenuItem(Module.email);
							setScreenState(Module.main);
						}}
					/>
				)}
				{screenState === Module.domains && (
					<AppDomains
						onExit={() => {
							setLastSelectedMainMenuItem(Module.domains);
							setScreenState(Module.main);
						}}
					/>
				)}
				{screenState === Module.apiKeys && (
					<AppApiKey
						onExit={() => {
							setLastSelectedMainMenuItem(Module.apiKeys);
							setScreenState(Module.main);
						}}
					/>
				)}
				{screenState === Module.audiences && (
					<AppAudiences
						onExit={() => {
							setLastSelectedMainMenuItem(Module.audiences);
							setScreenState(Module.main);
						}}
					/>
				)}
				{screenState === Module.broadcasts && (
					<AppBroadcasts
						onExit={() => {
							setLastSelectedMainMenuItem(Module.broadcasts);
							setScreenState(Module.main);
						}}
					/>
				)}
				{screenState === Module.contacts && (
					<AppContacts
						onExit={() => {
							setLastSelectedMainMenuItem(Module.contacts);
							setScreenState(Module.main);
						}}
					/>
				)}
			</ResendProvider>
		</DryRunProvider>
	);
};
