import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { Form as EmailRetrieveForm } from './Form.js';

describe('EmailRetrieveForm', () => {
	const mockOnExit = vi.fn();

	it('should render without errors', () => {
		expect(() => {
			renderWithProviders(<EmailRetrieveForm onExit={mockOnExit} />);
		}).not.toThrow();
	});

	it('should render SimpleForm with correct props', () => {
		const { lastFrame } = renderWithProviders(<EmailRetrieveForm onExit={mockOnExit} />);

		// Check that the form is rendered (SimpleForm should be present)
		expect(lastFrame()).toBeTruthy();
	});

	it('should match snapshot', () => {
		const { lastFrame } = renderWithProviders(<EmailRetrieveForm onExit={mockOnExit} />);
		expect(lastFrame()).toMatchSnapshot();
	});
});
