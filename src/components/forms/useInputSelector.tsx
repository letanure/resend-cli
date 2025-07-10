import { useState } from 'react';
import type { ApiResult } from '@/types/index.js';
import { type SelectableItem, SelectionModal } from './SelectionModal.js';

interface UseInputSelectorProps<T extends SelectableItem, D = Record<string, unknown>> {
	title: string;
	loadFunction: (data: D, apiKey: string) => Promise<ApiResult<{ data: Array<T> }>>;
	formatData: (data: { data: Array<T> }) => Array<Record<string, unknown>>;
	loadData?: D;
	noDataMessage?: string;
	idField?: string;
	displayField?: string;
	onSelect: (value: string) => void;
}

export function useInputSelector<T extends SelectableItem, D = Record<string, unknown>>({
	title,
	loadFunction,
	formatData,
	loadData,
	noDataMessage = 'No items found.',
	idField = 'id',
	displayField = 'id',
	onSelect,
}: UseInputSelectorProps<T, D>) {
	const [isOpen, setIsOpen] = useState(false);

	const openSelector = () => setIsOpen(true);
	const closeSelector = () => setIsOpen(false);

	const handleSelect = (item: T) => {
		const selectedId = String(item[idField] || '');
		onSelect(selectedId);
		closeSelector();
	};

	const handleCancel = () => {
		closeSelector();
	};

	const selectorComponent = isOpen ? (
		<SelectionModal
			title={title}
			isOpen={isOpen}
			onSelect={handleSelect}
			onCancel={handleCancel}
			loadFunction={loadFunction}
			formatData={formatData}
			loadData={loadData}
			noDataMessage={noDataMessage}
			idField={idField}
			displayField={displayField}
		/>
	) : null;

	return {
		isOpen,
		openSelector,
		closeSelector,
		selectorComponent,
	};
}
