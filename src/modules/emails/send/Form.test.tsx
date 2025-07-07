import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { Form } from './Form.js';

describe('Email Send Form', () => {
	const mockOnExit = vi.fn();

	it('renders form with email fields', () => {
		const { lastFrame } = renderWithProviders(<Form onExit={mockOnExit} />);

		const output = lastFrame();
		expect(output).toContain('From');
		expect(output).toContain('To');
		expect(output).toContain('Subject');
		expect(output).toContain('HTML Content');
		expect(output).toContain('Plain Text');
	});

	it('exits when ESC is pressed', async () => {
		const { stdin } = renderWithProviders(<Form onExit={mockOnExit} />);

		await stdin.write('\x1B'); // ESC key

		expect(mockOnExit).toHaveBeenCalled();
	});

	it('shows dry-run banner in dry-run mode', () => {
		const { lastFrame } = renderWithProviders(<Form onExit={mockOnExit} />, { isDryRun: true });

		expect(lastFrame()).toContain('DRY RUN MODE');
	});

	it('shows validation errors when submitting empty form', async () => {
		const { lastFrame, stdin } = renderWithProviders(<Form onExit={mockOnExit} />);

		// Submit without filling fields
		await stdin.write('\r'); // Enter key
		await new Promise((resolve) => setTimeout(resolve, 50));

		const output = lastFrame();
		expect(output).toContain('Required'); // Validation error
	});

	it('renders correctly in dry-run mode', () => {
		const { lastFrame } = renderWithProviders(<Form onExit={mockOnExit} />, { isDryRun: true });

		const output = lastFrame();
		expect(output).toContain('DRY RUN MODE');
		expect(output).toContain('From');
	});

	it('renders correctly in normal mode', () => {
		const { lastFrame } = renderWithProviders(<Form onExit={mockOnExit} />, { isDryRun: false });

		const output = lastFrame();
		expect(output).not.toContain('DRY RUN MODE');
		expect(output).toContain('From');
	});
});
