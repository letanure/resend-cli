import { render } from 'ink-testing-library';
import type { ReactElement } from 'react';
import { DryRunProvider } from '@/contexts/DryRunProvider.js';
import { ResendProvider } from '@/contexts/ResendProvider.js';

interface RenderOptions {
	isDryRun?: boolean;
}

export function renderWithProviders(
	ui: ReactElement,
	{ isDryRun = false }: RenderOptions = {},
): ReturnType<typeof render> {
	return render(
		<DryRunProvider isDryRun={isDryRun}>
			<ResendProvider>{ui}</ResendProvider>
		</DryRunProvider>,
	);
}
