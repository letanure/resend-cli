import { useState } from 'react';
import { Form as CreateForm } from './create/Form.js';
import { DomainsMenu, DomainsMenuState, type DomainsMenuState as DomainsMenuStateType } from './DomainsMenu.js';
import { Form as DeleteForm } from './delete/Form.js';
import { Form as ListForm } from './list/Form.js';
import { Form as RetrieveForm } from './retrieve/Form.js';
import { Form as UpdateForm } from './update/Form.js';
import { Form as VerifyForm } from './verify/Form.js';

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
				<CreateForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.create);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'retrieve' && (
				<RetrieveForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.retrieve);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'verify' && (
				<VerifyForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.verify);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'update' && (
				<UpdateForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.update);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'list' && (
				<ListForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.list);
						setScreenState('menu');
					}}
				/>
			)}
			{screenState === 'delete' && (
				<DeleteForm
					onExit={() => {
						setLastSelectedDomainMenuItem(DomainsMenuState.delete);
						setScreenState('menu');
					}}
				/>
			)}
		</>
	);
};
