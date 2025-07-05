import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Main } from './Main.js';

// Mock the send command that EmailForm uses
vi.mock('./commands/send.js', () => ({
	sendCommand: vi.fn(),
}));

describe('App Component', () => {
	it('renders main menu interface', () => {
		const { lastFrame } = render(<Main />);
		const output = lastFrame() ?? '';

		expect(output).toContain('📧 Resend CLI');
	});

	it('shows menu options', () => {
		const { lastFrame } = render(<Main />);
		const output = lastFrame() ?? '';

		expect(output).toContain('Email');
		expect(output).toContain('Domains');
		expect(output).toContain('Send, retrieve, update, and cancel emails');
	});

	it('shows navigation instructions', () => {
		const { lastFrame } = render(<Main />);
		const output = lastFrame() ?? '';

		expect(output).toContain('Use ↑/↓ to navigate');
	});
});
