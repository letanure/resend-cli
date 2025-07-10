import { expect, test, vi } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { DataDisplay } from './DataDisplay.js';

const mockOnExit = vi.fn();

test('DataDisplay renders success message and data fields', () => {
	const testData = {
		id: 'test-123',
		name: 'Test Broadcast',
		created_at: '2023-12-01T10:00:00Z',
	};

	const { lastFrame } = renderWithProviders(
		<DataDisplay
			data={testData}
			successMessage="Test successful"
			headerText="Test Header"
			fieldsToShow={['id', 'name']}
			onExit={mockOnExit}
		/>,
	);

	expect(lastFrame()).toContain('Test successful');
	expect(lastFrame()).toContain('test-123');
	expect(lastFrame()).toContain('Test Broadcast');
});

test('DataDisplay renders with field definitions for proper labeling', () => {
	const testData = {
		broadcastId: 'broadcast-456',
	};

	const fields = [
		{
			name: 'broadcastId',
			label: 'Broadcast ID',
			helpText: 'The unique identifier',
		},
	];

	const { lastFrame } = renderWithProviders(
		<DataDisplay
			data={testData}
			successMessage="Created successfully"
			headerText="Test Header"
			fields={fields}
			fieldsToShow={['broadcastId']}
			onExit={mockOnExit}
		/>,
	);

	expect(lastFrame()).toContain('Broadcast ID:');
	expect(lastFrame()).toContain('broadcast-456');
});

test('DataDisplay shows only specified fields when fieldsToShow is provided', () => {
	const testData = {
		id: 'test-123',
		name: 'Test Name',
		secret: 'should-not-show',
	};

	const { lastFrame } = renderWithProviders(
		<DataDisplay
			data={testData}
			successMessage="Success"
			headerText="Test Header"
			fieldsToShow={['id', 'name']}
			onExit={mockOnExit}
		/>,
	);

	expect(lastFrame()).toContain('test-123');
	expect(lastFrame()).toContain('Test Name');
	expect(lastFrame()).not.toContain('should-not-show');
});
