import { useApp } from 'ink';
import { useState } from 'react';
import { App as AppApiKey } from '@/modules/api-keys/App.js';
import { App as AppAudiences } from '@/modules/audiences/App.js';
import { App as AppBroadcasts } from '@/modules/broadcasts/App.js';
import { App as AppContacts } from '@/modules/contacts/App.js';
import { App as AppDomains } from '@/modules/domains/App.js';
import { App as AppEmail } from '@/modules/emails/App.js';
import { Module } from '@/types/index.js';
import { MainMenu } from './components/MainMenu.js';
import { DryRunProvider } from './contexts/DryRunProvider.js';
import { ResendProvider } from './contexts/ResendProvider.js';

interface AppMainProps {
	isDryRun?: boolean;
	apiKey?: string;
}

export const AppMain = ({ isDryRun = false, apiKey }: AppMainProps) => {
	const { exit } = useApp();
	const [screenState, setScreenState] = useState<Module>(Module.main);
	const [lastSelectedMainMenuItem, setLastSelectedMainMenuItem] = useState<Module>();

	return (
		<DryRunProvider isDryRun={isDryRun}>
			<ResendProvider apiKey={apiKey}>
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
