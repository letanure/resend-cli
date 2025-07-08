import { useState } from 'react';
import {
	AudiencesMenu,
	AudiencesMenuState,
	type AudiencesMenuState as AudiencesMenuStateType,
} from './AudiencesMenu.js';
import { AudienceCreateForm } from './create/Form.js';
import { DeleteAudienceForm } from './delete/Form.js';
import { ListAudienceForm } from './list/Form.js';
import { RetrieveAudienceForm } from './retrieve/Form.js';

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
				<RetrieveAudienceForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteAudienceForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListAudienceForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
