import { useState } from 'react';
import { AudienceCreateForm } from './AudienceCreateForm.js';
import { AudienceDeleteForm } from './AudienceDeleteForm.js';
import { AudienceListForm } from './AudienceListForm.js';
import { AudienceRetrieveForm } from './AudienceRetrieveForm.js';
import { AudiencesMenu, type AudiencesMenuState } from './AudiencesMenu.js';

type AudiencesMenuStateWithMenu = 'menu' | AudiencesMenuState;

interface AppAudiencesProps {
	onExit: () => void;
}

export const AppAudiences = ({ onExit }: AppAudiencesProps) => {
	const [screenState, setScreenState] = useState<AudiencesMenuStateWithMenu>('menu');

	const handleMenuSelect = (menuId: AudiencesMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && <AudiencesMenu onSelect={handleMenuSelect} onExit={() => onExit()} />}
			{screenState === 'create' && <AudienceCreateForm onExit={() => setScreenState('menu')} />}
			{screenState === 'retrieve' && <AudienceRetrieveForm onExit={() => setScreenState('menu')} />}
			{screenState === 'delete' && <AudienceDeleteForm onExit={() => setScreenState('menu')} />}
			{screenState === 'list' && <AudienceListForm onExit={() => setScreenState('menu')} />}
		</>
	);
};
