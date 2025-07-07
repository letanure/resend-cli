import { useState } from 'react';
import { AudienceDeleteForm } from './AudienceDeleteForm.js';
import { AudienceListForm } from './AudienceListForm.js';
import { AudienceRetrieveForm } from './AudienceRetrieveForm.js';
import {
	AudiencesMenu,
	AudiencesMenuState,
	type AudiencesMenuState as AudiencesMenuStateType,
} from './AudiencesMenu.js';
import { AudienceCreateForm } from './create/Form.js';

type AudiencesMenuStateWithMenu = 'menu' | AudiencesMenuStateType;

interface AppAudiencesProps {
	onExit: () => void;
}

export const AppAudiences = ({ onExit }: AppAudiencesProps) => {
	const [screenState, setScreenState] = useState<AudiencesMenuStateWithMenu>('menu');
	const [lastSelectedAudienceMenuItem, setLastSelectedAudienceMenuItem] = useState<AudiencesMenuStateType>();

	const handleMenuSelect = (menuId: AudiencesMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<AudiencesMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedAudienceMenuItem}
				/>
			)}
			{screenState === 'create' && (
				<AudienceCreateForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<AudienceRetrieveForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<AudienceDeleteForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<AudienceListForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.liest);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
