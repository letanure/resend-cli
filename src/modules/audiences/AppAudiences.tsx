import { useState } from 'react';
import {
	AudiencesMenu,
	AudiencesMenuState,
	type AudiencesMenuState as AudiencesMenuStateType,
} from './AudiencesMenu.js';
import { Form as CreateForm } from './create/Form.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Form as RetrieveForm } from './retrieve/Form.js';

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
				<CreateForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedAudienceMenuItem(AudiencesMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
