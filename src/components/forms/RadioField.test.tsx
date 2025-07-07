import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { RadioField } from './RadioField.js';

describe('RadioField', () => {
	const mockOptions = [
		{ value: false, label: 'Subscribed', color: 'green' as const, icon: '✓' },
		{ value: true, label: 'Unsubscribed', color: 'red' as const, icon: '✗' },
	];

	const mockOnToggle = vi.fn();

	it('should render radio field with options', () => {
		const { lastFrame } = render(
			<RadioField label="Test Label" options={mockOptions} value={false} isActive={false} onToggle={mockOnToggle} />,
		);

		expect(lastFrame()).toContain('Test Label:');
		expect(lastFrame()).toContain('[✓] Subscribed');
		expect(lastFrame()).toContain('[ ] Unsubscribed');
		expect(lastFrame()).toContain('|');
	});

	it('should show selected option correctly', () => {
		const { lastFrame } = render(
			<RadioField label="Test Label" options={mockOptions} value={true} isActive={false} onToggle={mockOnToggle} />,
		);

		expect(lastFrame()).toContain('[ ] Subscribed');
		expect(lastFrame()).toContain('[✓] Unsubscribed');
	});

	it('should show help text when active', () => {
		const { lastFrame } = render(
			<RadioField label="Test Label" options={mockOptions} value={false} isActive={true} onToggle={mockOnToggle} />,
		);

		expect(lastFrame()).toContain('(Use ←/→ or Space)');
	});

	it('should show help text when provided', () => {
		const { lastFrame } = render(
			<RadioField
				label="Test Label"
				options={mockOptions}
				value={false}
				isActive={true}
				helpText="This is help text"
				onToggle={mockOnToggle}
			/>,
		);

		expect(lastFrame()).toContain('This is help text');
	});

	it('should show error message when provided', () => {
		const { lastFrame } = render(
			<RadioField
				label="Test Label"
				options={mockOptions}
				value={false}
				isActive={true}
				errorMessage="This is an error"
				onToggle={mockOnToggle}
			/>,
		);

		expect(lastFrame()).toContain('This is an error');
	});

	it('should use custom label width', () => {
		const { lastFrame } = render(
			<RadioField
				label="Short Label"
				options={mockOptions}
				value={false}
				isActive={false}
				labelWidth={35}
				onToggle={mockOnToggle}
			/>,
		);

		expect(lastFrame()).toContain('Short Label:');
		expect(lastFrame()).toContain('[✓] Subscribed');
	});
});
