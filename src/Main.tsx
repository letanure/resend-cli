import { useApp } from 'ink';
import { useState } from 'react';
import { AppApiKey } from './api-key/AppApiKey.js';
import { AppAudiences } from './audiences/AppAudiences.js';
import { AppBroadcasts } from './broadcasts/AppBroadcasts.js';
import { MainMenu } from './components/MainMenu.js';
import { AppContacts } from './contacts/AppContacts.js';
import { AppDomains } from './domains/AppDomains.js';
import { AppEmail } from './emails/AppEmail.js';
import { AppState } from './types.js';

export const Main = () => {
	const { exit } = useApp();
	const [screenState, setScreenState] = useState<AppState>(AppState.main);

	return (
		<>
			{screenState === AppState.main && <MainMenu onSelect={(menuId) => setScreenState(menuId)} onExit={exit} />}
			{screenState === AppState.email && <AppEmail onExit={() => setScreenState(AppState.main)} />}
			{screenState === AppState.domains && <AppDomains onExit={() => setScreenState(AppState.main)} />}
			{screenState === AppState.apiKeys && <AppApiKey onExit={() => setScreenState(AppState.main)} />}
			{screenState === AppState.audiences && <AppAudiences onExit={() => setScreenState(AppState.main)} />}
			{screenState === AppState.broadcasts && <AppBroadcasts onExit={() => setScreenState(AppState.main)} />}
			{screenState === AppState.contacts && <AppContacts onExit={() => setScreenState(AppState.main)} />}
		</>
	);
};
