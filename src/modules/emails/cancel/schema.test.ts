import { describe, expect, it } from 'vitest';
import { CancelEmailOptionsSchema } from './schema.js';

describe('CancelEmailOptionsSchema', () => {
	const validEmailId = '402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f';

	it('validates correct email cancel data', () => {
		const validData = {
			id: validEmailId,
		};

		const result = CancelEmailOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('rejects invalid email ID format', () => {
		const invalidData = {
			id: 'invalid-id',
		};

		const result = CancelEmailOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects email ID with wrong length', () => {
		const invalidData = {
			id: '402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f-extra',
		};

		const result = CancelEmailOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('requires id field', () => {
		const incompleteData = {};

		const result = CancelEmailOptionsSchema.safeParse(incompleteData);
		expect(result.success).toBe(false);
	});

	it('accepts different valid UUID formats', () => {
		const validIds = [
			'402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f',
			'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
			'12345678-1234-1234-1234-123456789ABC',
		];

		for (const id of validIds) {
			const result = CancelEmailOptionsSchema.safeParse({ id });
			expect(result.success).toBe(true);
		}
	});
});
