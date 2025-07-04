import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { App } from './app.js';

describe('App Component', () => {
	it('renders welcome message', () => {
		const { lastFrame } = render(<App />);

		expect(lastFrame()).toContain('Welcome to Resend CLI! 🚀');
	});

	it('renders description message', () => {
		const { lastFrame } = render(<App />);

		expect(lastFrame()).toContain('This is a TypeScript + Ink CLI wrapper for the Resend API.');
	});

	it('renders both messages in correct order', () => {
		const { lastFrame } = render(<App />);
		const output = lastFrame() ?? '';

		const welcomeIndex = output.indexOf('Welcome to Resend CLI! 🚀');
		const descriptionIndex = output.indexOf('This is a TypeScript + Ink CLI wrapper for the Resend API.');

		expect(welcomeIndex).toBeGreaterThan(-1);
		expect(descriptionIndex).toBeGreaterThan(-1);
		expect(welcomeIndex).toBeLessThan(descriptionIndex);
	});
});
