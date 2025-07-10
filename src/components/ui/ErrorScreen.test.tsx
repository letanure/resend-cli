import { expect, test, vi } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { ErrorScreen } from './ErrorScreen.js';

const mockOnExit = vi.fn();
const mockOnRetry = vi.fn();

test('ErrorScreen renders error message with navigation', () => {
	const { lastFrame } = renderWithProviders(
		<ErrorScreen title="Test Error" message="Something went wrong" headerText="Test App - Error" onExit={mockOnExit} />,
	);

	expect(lastFrame()).toContain('Test Error');
	expect(lastFrame()).toContain('Something went wrong');
	expect(lastFrame()).toContain('Press Esc or q to go back');
});

test('ErrorScreen shows suggestion when provided', () => {
	const { lastFrame } = renderWithProviders(
		<ErrorScreen
			title="API Error"
			message="Failed to create resource"
			suggestion="Check your API key and try again"
			headerText="Test App - Error"
			onExit={mockOnExit}
		/>,
	);

	expect(lastFrame()).toContain('Check your API key and try again');
});

test('ErrorScreen shows retry option when enabled', () => {
	const { lastFrame } = renderWithProviders(
		<ErrorScreen
			title="Network Error"
			message="Connection failed"
			headerText="Test App - Error"
			onExit={mockOnExit}
			showRetry={true}
			onRetry={mockOnRetry}
		/>,
	);

	expect(lastFrame()).toContain('Press Enter or r to retry');
	expect(lastFrame()).toContain('Esc or q to go back');
});

test('ErrorScreen uses default title when not provided', () => {
	const { lastFrame } = renderWithProviders(
		<ErrorScreen message="Default error test" headerText="Test App - Error" onExit={mockOnExit} />,
	);

	expect(lastFrame()).toContain('Error');
	expect(lastFrame()).toContain('Default error test');
});
