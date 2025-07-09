import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { AppMain } from './AppMain.js';

describe('App Component', () => {
	it('renders main menu interface', () => {
		const { lastFrame } = renderWithProviders(<AppMain />);
		const output = lastFrame() ?? '';

		expect(output).toContain('📧 Resend CLI');
	});

	it('shows all menu options', () => {
		const { lastFrame } = renderWithProviders(<AppMain />);
		const output = lastFrame() ?? '';

		// Check all menu items
		expect(output).toContain('Email');

		expect(output).toContain('Domains');

		expect(output).toContain('API Keys');

		expect(output).toContain('Broadcasts');

		expect(output).toContain('Audiences');

		expect(output).toContain('Contacts');
	});

	it('shows navigation instructions', () => {
		const { lastFrame } = renderWithProviders(<AppMain />);
		const output = lastFrame() ?? '';

		expect(output).toContain('Use ↑/↓ to navigate, Enter/→ to select, q/ESC to quit');
	});
});
