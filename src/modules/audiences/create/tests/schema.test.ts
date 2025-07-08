import { describe, expect, it } from 'vitest';
import { CreateAudienceOptionsSchema } from '../schema.js';

describe('CreateAudienceOptionsSchema', () => {
	it('validates correct audience data', () => {
		const validData = {
			name: 'Registered Users',
		};

		const result = CreateAudienceOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('rejects empty name', () => {
		const invalidData = {
			name: '',
		};

		const result = CreateAudienceOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects missing name', () => {
		const invalidData = {};

		const result = CreateAudienceOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('trims whitespace from name', () => {
		const dataWithWhitespace = {
			name: '  Newsletter Subscribers  ',
		};

		const result = CreateAudienceOptionsSchema.safeParse(dataWithWhitespace);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe('Newsletter Subscribers');
		}
	});

	it('rejects name that is too long', () => {
		const invalidData = {
			name: 'a'.repeat(101), // 101 characters, exceeds 100 limit
		};

		const result = CreateAudienceOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('accepts name at maximum length', () => {
		const validData = {
			name: 'a'.repeat(100), // exactly 100 characters
		};

		const result = CreateAudienceOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});
});
