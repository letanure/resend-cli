import { describe, expect, it } from 'vitest';
import { ListDomainsOptionsSchema } from './schema.js';

describe('ListDomainsOptionsSchema', () => {
	it('should validate empty object successfully', () => {
		const result = ListDomainsOptionsSchema.safeParse({});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({});
		}
	});

	it('should accept additional properties and ignore them', () => {
		const result = ListDomainsOptionsSchema.safeParse({
			someExtraProperty: 'value',
			anotherProperty: 123,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({});
		}
	});

	it('should handle null input', () => {
		const result = ListDomainsOptionsSchema.safeParse(null);

		expect(result.success).toBe(false);
	});

	it('should handle undefined input', () => {
		const result = ListDomainsOptionsSchema.safeParse(undefined);

		expect(result.success).toBe(false);
	});

	it('should handle string input', () => {
		const result = ListDomainsOptionsSchema.safeParse('not an object');

		expect(result.success).toBe(false);
	});
});
