import { describe, expect, it } from 'vitest';
import { RetrieveAudienceOptionsSchema } from '../schema.js';

describe('RetrieveAudienceOptionsSchema', () => {
	it('validates correct audience ID', () => {
		const validData = {
			id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		const result = RetrieveAudienceOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('rejects empty ID', () => {
		const invalidData = {
			id: '',
		};

		const result = RetrieveAudienceOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects missing ID', () => {
		const invalidData = {};

		const result = RetrieveAudienceOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('trims whitespace from ID', () => {
		const dataWithWhitespace = {
			id: '  78261eea-8f8b-4381-83c6-79fa7120f1cf  ',
		};

		const result = RetrieveAudienceOptionsSchema.safeParse(dataWithWhitespace);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.id).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
		}
	});

	it('rejects non-UUID format', () => {
		const invalidData = {
			id: 'not-a-uuid',
		};

		const result = RetrieveAudienceOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('accepts valid UUID format', () => {
		const validUUIDs = [
			'78261eea-8f8b-4381-83c6-79fa7120f1cf',
			'12345678-1234-1234-1234-123456789abc',
			'87654321-4321-4321-4321-cba987654321',
		];

		for (const id of validUUIDs) {
			const validData = { id };
			const result = RetrieveAudienceOptionsSchema.safeParse(validData);
			expect(result.success).toBe(true);
		}
	});
});
