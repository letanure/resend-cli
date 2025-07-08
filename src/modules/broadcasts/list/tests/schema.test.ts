import { describe, expect, it } from 'vitest';
import { listBroadcastsSchema } from '../schema.js';

describe('listBroadcastsSchema', () => {
	it('should validate empty object', () => {
		const result = listBroadcastsSchema.safeParse({});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({});
		}
	});

	it('should ignore additional properties', () => {
		const result = listBroadcastsSchema.safeParse({
			unexpectedProperty: 'value',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({});
		}
	});

	it('should handle null input', () => {
		const result = listBroadcastsSchema.safeParse(null);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Expected object');
		}
	});

	it('should handle undefined input', () => {
		const result = listBroadcastsSchema.safeParse(undefined);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Required');
		}
	});

	it('should handle string input', () => {
		const result = listBroadcastsSchema.safeParse('invalid');

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Expected object');
		}
	});
});
