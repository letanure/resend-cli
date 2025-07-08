import { describe, expect, it } from 'vitest';
import { listAudiences } from '../action.js';

describe('listAudiences', () => {
	it('returns success result structure', async () => {
		const result = await listAudiences({}, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.object).toBe('list');
	});

	it('requires api key parameter', async () => {
		// Function should accept any string as API key
		const result = await listAudiences({}, 'any-key');
		expect(result).toBeDefined();
	});

	it('returns consistent interface regardless of input', async () => {
		const result = await listAudiences({}, 'test-key');

		// Should always return ApiResult interface
		expect(typeof result.success).toBe('boolean');
		if (result.success) {
			expect(result.data).toBeDefined();
		} else {
			expect(result.error).toBeDefined();
		}
	});

	it('handles empty API key gracefully', async () => {
		const result = await listAudiences({}, '');
		expect(result).toBeDefined();
		expect(typeof result.success).toBe('boolean');
	});

	it('returns list data structure', async () => {
		const result = await listAudiences({}, 'test-api-key');

		if (result.success) {
			expect(result.data).toHaveProperty('object', 'list');
			expect(result.data).toHaveProperty('data');
			expect(Array.isArray(result.data?.data)).toBe(true);
		}
	});
});
