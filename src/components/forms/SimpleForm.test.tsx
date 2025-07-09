import { render } from 'ink-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { FormField } from '@/types/index.js';
import { SimpleForm } from './SimpleForm.js';

describe('SimpleForm', () => {
	const textFields: Array<FormField> = [
		{
			name: 'email',
			label: 'Email',
			placeholder: 'user@example.com',
			helpText: 'Enter your email address',
			type: 'text',
		},
	];

	const selectFields: Array<FormField> = [
		{
			name: 'subscribed',
			label: 'Subscription',
			type: 'select',
			options: [
				{ value: true, label: 'Yes', color: 'green' },
				{ value: false, label: 'No', color: 'red' },
			],
		},
	];

	const mixedFields: Array<FormField> = [...textFields, ...selectFields];

	const mockOnSubmit = vi.fn();
	const mockOnCancel = vi.fn();

	it('should render text fields', () => {
		const { lastFrame } = render(<SimpleForm fields={textFields} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

		expect(lastFrame()).toContain('Email');
		expect(lastFrame()).toContain('Enter your email address');
	});

	it('should render select fields', () => {
		const { lastFrame } = render(<SimpleForm fields={selectFields} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

		expect(lastFrame()).toContain('Subscription');
		expect(lastFrame()).toContain('[✓] Yes');
		expect(lastFrame()).toContain('[ ] No');
		expect(lastFrame()).toContain('Use ←/→ or Space');
	});

	it('should render mixed field types', () => {
		const { lastFrame } = render(<SimpleForm fields={mixedFields} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

		expect(lastFrame()).toContain('Email');
		expect(lastFrame()).toContain('Subscription');
		expect(lastFrame()).toContain('[✓] Yes');
	});

	it('should show validation schema in action', () => {
		const schema = z.object({
			email: z.string().email(),
			subscribed: z.boolean(),
		});

		const { lastFrame } = render(
			<SimpleForm fields={mixedFields} validateWith={schema} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />,
		);

		expect(lastFrame()).toContain('Email');
		expect(lastFrame()).toContain('Subscription');
	});

	it('should handle select field default values', () => {
		const { lastFrame } = render(<SimpleForm fields={selectFields} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

		// First option should be selected by default
		expect(lastFrame()).toContain('[✓] Yes');
		expect(lastFrame()).toContain('[ ] No');
	});
});
