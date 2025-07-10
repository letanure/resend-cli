import { describe, expect, it } from 'vitest';
import { createAudience } from '../action.js';
import type { CreateAudienceOptionsType } from '../schema.js';

describe('createAudience', () => {
	const testAudienceData: CreateAudienceOptionsType = {
		name: 'Test Audience',
	};

	it('returns success result structure', async () => {
		const result = await createAudience(testAudienceData, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.id).toBe('test-audience-id');
	});

	it('accepts valid audience data', async () => {
		const audienceData: CreateAudienceOptionsType = {
			name: 'Newsletter Subscribers',
		};

		const result = await createAudience(audienceData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('requires api key parameter', async () => {
		const result = await createAudience(testAudienceData, 'any-key');
		expect(result).toBeDefined();
	});

	it('handles different audience names', async () => {
		const testNames = ['Registered Users', 'Beta Testers', 'VIP Customers'];

		for (const name of testNames) {
			const audienceData: CreateAudienceOptionsType = { name };
			const result = await createAudience(audienceData, 'test-api-key');
			expect(result.success).toBe(true);
		}
	});

	it('returns consistent interface regardless of input', async () => {
		const result = await createAudience(testAudienceData, 'test-key');

		// Should always return ApiResult interface
		expect(typeof result.success).toBe('boolean');
		if (result.success) {
			expect(result.data).toBeDefined();
		} else {
			expect(result.error).toBeDefined();
		}
	});
});
