import { useState } from 'react';
import type { ApiResult, CliField } from '@/types/index.js';
import { type SelectableItem, SelectableListDisplay } from './SelectableListDisplay.js';

interface UseInputSelectorProps<T extends SelectableItem, D = Record<string, unknown>> {
	title: string;
	loadFunction: (data: D, apiKey: string) => Promise<ApiResult<{ data: Array<T> }>>;
	formatData: (data: { data: Array<T> }) => Array<Record<string, unknown>>;
	displayFields: Array<CliField>;
	loadData?: D;
	noDataMessage?: string;
	onSelect: (value: string) => void;
}

export function useInputSelector<T extends SelectableItem, D = Record<string, unknown>>({
	title,
	loadFunction,
	formatData,
	displayFields,
	loadData,
	noDataMessage = 'No items found.',
	onSelect,
}: UseInputSelectorProps<T, D>) {
	const [isOpen, setIsOpen] = useState(false);

	const openSelector = () => setIsOpen(true);
	const closeSelector = () => setIsOpen(false);

	const handleSelect = (item: T) => {
		const selectedId = String(item.id || '');
		onSelect(selectedId);
		closeSelector();
	};

	const handleCancel = () => {
		closeSelector();
	};

	const selectorComponent = isOpen ? (
		<SelectableListDisplay
			title={title}
			isOpen={isOpen}
			onSelect={handleSelect}
			onCancel={handleCancel}
			loadFunction={loadFunction}
			formatData={formatData}
			displayFields={displayFields}
			loadData={loadData}
			noDataMessage={noDataMessage}
		/>
	) : null;

	return {
		isOpen,
		openSelector,
		closeSelector,
		selectorComponent,
	};
}
