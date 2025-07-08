import { useState } from 'react';
import { CreateDomainForm } from './create/Form.js';
import { DomainDeleteForm } from './DomainDeleteForm.js';
import { DomainListForm } from './DomainListForm.js';
import { DomainsMenu, DomainsMenuState, type DomainsMenuState as DomainsMenuStateType } from './DomainsMenu.js';
import { DomainUpdateForm } from './DomainUpdateForm.js';
import { DomainVerifyForm } from './DomainVerifyForm.js';
import { DomainRetrieveForm } from './retrieve/Form.js';

type DomainsMenuStateWithMenu = 'menu' | DomainsMenuStateType;

interface AppDomainsProps {
	onExit: () => void;
}

export const AppDomains = ({ onExit }: AppDomainsProps) => {
	const [screenState, setScreenState] = useState<DomainsMenuStateWithMenu>('menu');
	const [lastSelectedDomainMenuItem, setLastSelectedDomainMenuItem] = useState<DomainsMenuStateType>();

	const handleMenuSelect = (menuId: DomainsMenuStateWithMenu) => {
		setScreenState(menuId);
	};

	return (
		<>
			{screenState === 'menu' && (
				<DomainsMenu
					onSelect={handleMenuSelect}
					onExit={() => onExit()}
					initialSelectedKey={lastSelectedDomainMenuItem}
				/>
			)}
			{screenState === 'create' && (
				<CreateDomainForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<DomainRetrieveForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'verify' && (
				<DomainVerifyForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.verify);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<DomainUpdateForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<DomainListForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DomainDeleteForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
