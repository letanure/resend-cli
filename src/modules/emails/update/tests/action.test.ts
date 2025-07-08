import { describe, expect, it } from 'vitest';
import { updateEmail } from '../action.js';
import type { UpdateEmailOptionsType } from '../schema.js';

describe('updateEmail', () => {
	const testUpdateData: UpdateEmailOptionsType = {
		id: '4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
		scheduled_at: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
	};

	it('returns success result structure', async () => {
		const result = await updateEmail(testUpdateData, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.id).toBe('test-email-id');
	});

	it('accepts valid update data', async () => {
		const updateData: UpdateEmailOptionsType = {
			id: '12345678-1234-1234-1234-123456789abc',
			scheduled_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
		};

		const result = await updateEmail(updateData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('requires api key parameter', async () => {
		// Function should accept any string as API key
		const result = await updateEmail(testUpdateData, 'any-key');
		expect(result).toBeDefined();
	});

	it('handles different email ID formats', async () => {
		const testIds = [
			'4ef9a417-02e9-4d39-ad75-9611e0fcc33c', // lowercase
			'4EF9A417-02E9-4D39-AD75-9611E0FCC33C', // uppercase
			'4Ef9A417-02e9-4D39-ad75-9611E0fcc33C', // mixed case
		];

		for (const emailId of testIds) {
			const updateData: UpdateEmailOptionsType = {
				id: emailId,
				scheduled_at: new Date(Date.now() + 60000).toISOString(),
			};
			const result = await updateEmail(updateData, 'test-api-key');
			expect(result.success).toBe(true);
		}
	});

	it('returns consistent interface regardless of input', async () => {
		const result = await updateEmail(testUpdateData, 'test-key');

		// Should always return ApiResult interface
		expect(typeof result.success).toBe('boolean');
		if (result.success) {
			expect(result.data).toBeDefined();
		} else {
			expect(result.error).toBeDefined();
		}
	});
});
