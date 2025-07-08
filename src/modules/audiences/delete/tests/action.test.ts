import { describe, expect, it } from 'vitest';
import { deleteAudience } from '../action.js';
import type { DeleteAudienceOptionsType } from '../schema.js';

describe('deleteAudience', () => {
	const testAudienceData: DeleteAudienceOptionsType = {
		id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
	};

	it('returns success result structure', async () => {
		const result = await deleteAudience(testAudienceData, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.id).toBe('test-audience-id');
	});

	it('accepts valid audience ID', async () => {
		const audienceData: DeleteAudienceOptionsType = {
			id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		const result = await deleteAudience(audienceData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('requires api key parameter', async () => {
		// Function should accept any string as API key
		const result = await deleteAudience(testAudienceData, 'any-key');
		expect(result).toBeDefined();
	});

	it('handles different audience IDs', async () => {
		const testIds = [
			'78261eea-8f8b-4381-83c6-79fa7120f1cf',
			'12345678-1234-1234-1234-123456789abc',
			'87654321-4321-4321-4321-cba987654321',
		];

		for (const id of testIds) {
			const audienceData: DeleteAudienceOptionsType = { id };
			const result = await deleteAudience(audienceData, 'test-api-key');
			expect(result.success).toBe(true);
		}
	});

	it('returns consistent interface regardless of input', async () => {
		const result = await deleteAudience(testAudienceData, 'test-key');

		// Should always return ApiResult interface
		expect(typeof result.success).toBe('boolean');
		if (result.success) {
			expect(result.data).toBeDefined();
		} else {
			expect(result.error).toBeDefined();
		}
	});
});
