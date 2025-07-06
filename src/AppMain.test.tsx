import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { AppMain } from './AppMain.js';

describe('App Component', () => {
	it('renders main menu interface', () => {
		const { lastFrame } = render(<AppMain />);
		const output = lastFrame() ?? '';

		expect(output).toContain('📧 Resend CLI');
	});

	it('shows all menu options', () => {
		const { lastFrame } = render(<AppMain />);
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
		const { lastFrame } = render(<AppMain />);
		const output = lastFrame() ?? '';

		expect(output).toContain('Use ↑/↓ to navigate, Enter to select q or ESC to go back');
	});
});
