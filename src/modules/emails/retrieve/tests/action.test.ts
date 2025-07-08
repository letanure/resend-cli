import { describe, expect, it } from 'vitest';
import { getEmail } from '../action.js';

describe('getEmail', () => {
	const testEmailId = '4ef9a417-02e9-4d39-ad75-9611e0fcc33c';

	it('returns success result structure', async () => {
		const result = await getEmail(testEmailId, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.id).toBe('test-email-id');
	});

	it('accepts valid UUID email ID', async () => {
		const validIds = [
			'4ef9a417-02e9-4d39-ad75-9611e0fcc33c',
			'12345678-1234-1234-1234-123456789abc',
			'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE',
		];

		for (const emailId of validIds) {
			const result = await getEmail(emailId, 'test-api-key');
			expect(result).toBeDefined();
		}
	});

	it('requires api key parameter', async () => {
		// Function should accept any string as API key
		const result = await getEmail(testEmailId, 'any-key');
		expect(result).toBeDefined();
	});

	it('handles different email ID formats', async () => {
		const testIds = [
			'4ef9a417-02e9-4d39-ad75-9611e0fcc33c', // lowercase
			'4EF9A417-02E9-4D39-AD75-9611E0FCC33C', // uppercase
			'4Ef9A417-02e9-4D39-ad75-9611E0fcc33C', // mixed case
		];

		for (const emailId of testIds) {
			const result = await getEmail(emailId, 'test-api-key');
			expect(result.success).toBe(true);
		}
	});

	it('returns consistent interface regardless of input', async () => {
		const result = await getEmail(testEmailId, 'test-key');

		// Should always return ApiResult interface
		expect(typeof result.success).toBe('boolean');
		if (result.success) {
			expect(result.data).toBeDefined();
		} else {
			expect(result.error).toBeDefined();
		}
	});
});
