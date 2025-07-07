import { describe, expect, it } from 'vitest';
import { ListAudienceOptionsSchema } from './schema.js';

describe('ListAudienceOptionsSchema', () => {
	it('validates empty object (no input required)', () => {
		const validData = {};

		const result = ListAudienceOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('ignores extra properties', () => {
		const dataWithExtra = {
			extraProperty: 'should be ignored',
			anotherProperty: 123,
		};

		const result = ListAudienceOptionsSchema.safeParse(dataWithExtra);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toEqual({});
		}
	});

	it('returns consistent empty object', () => {
		const testInputs = [{}, { ignored: 'value' }, { multiple: 'values', with: 'different', types: 123 }];

		for (const input of testInputs) {
			const result = ListAudienceOptionsSchema.safeParse(input);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual({});
			}
		}
	});
});
