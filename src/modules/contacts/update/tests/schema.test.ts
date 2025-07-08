import { describe, expect, it } from 'vitest';
import { updateContactSchema } from '../schema.js';

describe('updateContactSchema', () => {
	it('should validate with contact ID', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			firstName: 'John',
			lastName: 'Doe',
			unsubscribed: false,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
			expect(result.data.firstName).toBe('John');
			expect(result.data.lastName).toBe('Doe');
			expect(result.data.unsubscribed).toBe(false);
		}
	});

	it('should validate with email', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'john@example.com',
			firstName: 'John',
			unsubscribed: true,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.email).toBe('john@example.com');
			expect(result.data.firstName).toBe('John');
			expect(result.data.unsubscribed).toBe(true);
		}
	});

	it('should validate with both ID and email', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			email: 'john@example.com',
			lastName: 'Smith',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
			expect(result.data.email).toBe('john@example.com');
			expect(result.data.lastName).toBe('Smith');
		}
	});

	it('should validate with only required fields', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
		}
	});

	it('should fail validation without audience ID', () => {
		const result = updateContactSchema.safeParse({
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should fail validation without ID or email', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Either contact ID or email must be provided');
		}
	});

	it('should fail validation with empty audience ID', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should fail validation with invalid email', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'invalid-email',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('email');
		}
	});

	it('should trim whitespace from string fields', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '  78261eea-8f8b-4381-83c6-79fa7120f1cf  ',
			id: '  e169aa45-1ecf-4183-9955-b1499d5701d3  ',
			firstName: '  John  ',
			lastName: '  Doe  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
			expect(result.data.firstName).toBe('John');
			expect(result.data.lastName).toBe('Doe');
		}
	});

	it('should remove empty optional fields', () => {
		const result = updateContactSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			firstName: '',
			lastName: '',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
			expect(result.data.firstName).toBeUndefined();
			expect(result.data.lastName).toBeUndefined();
		}
	});

	it('should handle null values', () => {
		const result = updateContactSchema.safeParse({
			audienceId: null,
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Expected string, received null');
		}
	});
});
