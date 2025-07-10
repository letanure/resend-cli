import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { ResultScreen } from './ResultScreen.js';

describe('ResultScreen Component', () => {
	const mockOnContinue = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders success message', () => {
		const { lastFrame } = renderWithProviders(
			<ResultScreen
				type="success"
				message="Operation completed successfully"
				onContinue={mockOnContinue}
				headerText="Test Header"
			/>,
		);

		const output = lastFrame();
		expect(output).toContain('Operation completed successfully');
		expect(output).toContain('Test Header');
		expect(output).toContain('Press any key to continue...');
	});

	it('renders error message', () => {
		const { lastFrame } = renderWithProviders(
			<ResultScreen
				type="error"
				message="Something went wrong"
				onContinue={mockOnContinue}
				headerText="Error Occurred"
			/>,
		);

		const output = lastFrame();
		expect(output).toContain('Something went wrong');
		expect(output).toContain('Error Occurred');
	});

	it('calls onContinue when any key is pressed', async () => {
		const { stdin } = renderWithProviders(
			<ResultScreen type="success" message="Test message" onContinue={mockOnContinue} headerText="Test" />,
		);

		await stdin.write('a'); // Any key

		expect(mockOnContinue).toHaveBeenCalled();
	});

	it('calls onContinue when Enter is pressed', async () => {
		const { stdin } = renderWithProviders(
			<ResultScreen type="success" message="Test message" onContinue={mockOnContinue} headerText="Test" />,
		);

		await stdin.write('\r'); // Enter key

		expect(mockOnContinue).toHaveBeenCalled();
	});

	it('calls onContinue when Space is pressed', async () => {
		const { stdin } = renderWithProviders(
			<ResultScreen type="success" message="Test message" onContinue={mockOnContinue} headerText="Test" />,
		);

		await stdin.write(' '); // Space key

		expect(mockOnContinue).toHaveBeenCalled();
	});

	it('shows correct alert variant for success', () => {
		const { lastFrame } = renderWithProviders(
			<ResultScreen type="success" message="Success message" onContinue={mockOnContinue} headerText="Success" />,
		);

		expect(lastFrame()).toContain('Success message');
	});

	it('shows correct alert variant for error', () => {
		const { lastFrame } = renderWithProviders(
			<ResultScreen type="error" message="Error message" onContinue={mockOnContinue} headerText="Error" />,
		);

		expect(lastFrame()).toContain('Error message');
	});
});
