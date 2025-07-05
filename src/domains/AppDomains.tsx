import { useState } from 'react';
import { DomainCreateForm } from './DomainCreateForm.js';
import { DomainDeleteForm } from './DomainDeleteForm.js';
import { DomainListForm } from './DomainListForm.js';
import { DomainRetrieveForm } from './DomainRetrieveForm.js';
import { DomainsMenu, type DomainsMenuState } from './DomainsMenu.js';
import { DomainUpdateForm } from './DomainUpdateForm.js';
import { DomainVerifyForm } from './DomainVerifyForm.js';

type DomainsMenuStateWithMenu = 'menu' | DomainsMenuState;

interface AppDomainsProps {
	onExit: () => void;
}

export const AppDomains = ({ onExit }: AppDomainsProps) => {
	const [screenState, setScreenState] = useState<DomainsMenuStateWithMenu>('menu');

	const handleMenuSelect = (menuId: DomainsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && <DomainsMenu onSelect={handleMenuSelect} onExit={() => onExit()} />}
			{screenState === 'create' && <DomainCreateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'retrieve' && <DomainRetrieveForm onExit={() => setScreenState('menu')} />}
			{screenState === 'verify' && <DomainVerifyForm onExit={() => setScreenState('menu')} />}
			{screenState === 'update' && <DomainUpdateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'list' && <DomainListForm onExit={() => setScreenState('menu')} />}
			{screenState === 'delete' && <DomainDeleteForm onExit={() => setScreenState('menu')} />}
		</>
	);
};
