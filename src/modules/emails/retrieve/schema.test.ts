import { describe, expect, it } from 'vitest';
import { GetEmailOptionsSchema } from './schema.js';

describe('GetEmailOptionsSchema', () => {
	const validEmailId = '402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f';

	it('should validate a correct email ID', () => {
		const result = GetEmailOptionsSchema.safeParse({ id: validEmailId });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.id).toBe(validEmailId);
		}
	});

	it('should reject empty email ID', () => {
		const result = GetEmailOptionsSchema.safeParse({ id: '' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Email ID must be exactly 36 characters');
		}
	});

	it('should reject missing email ID', () => {
		const result = GetEmailOptionsSchema.safeParse({});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Required');
		}
	});

	it('should reject invalid UUID format', () => {
		const invalidIds = [
			'not-a-uuid',
			'123456789',
			'402a4ef4-3bd0-43fe-8e12-f6142bd2bd', // too short
			'402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f-extra', // too long
			'402a4ef4-3bd0-43fe-8e12-f6142bd2bd0g', // invalid character
			'402a4ef4-3bd0-43fe-8e12-f6142bd2bd0', // too short by 1
		];

		for (const invalidId of invalidIds) {
			const result = GetEmailOptionsSchema.safeParse({ id: invalidId });
			expect(result.success).toBe(false);
			if (!result.success) {
				const errorMessage = result.error.issues[0]?.message;
				expect(errorMessage).toBeDefined();
				expect(
					errorMessage?.includes('Email ID must be exactly 36 characters') ||
						errorMessage?.includes('Email ID must be a valid UUID format'),
				).toBe(true);
			}
		}
	});

	it('should accept UUID in different cases', () => {
		const testCases = [
			'402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f', // lowercase
			'402A4EF4-3BD0-43FE-8E12-F6142BD2BD0F', // uppercase
			'402A4ef4-3Bd0-43Fe-8e12-F6142bd2Bd0F', // mixed case
		];

		for (const testId of testCases) {
			const result = GetEmailOptionsSchema.safeParse({ id: testId });
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.id).toBe(testId);
			}
		}
	});

	it('should handle additional properties by ignoring them', () => {
		const result = GetEmailOptionsSchema.safeParse({
			id: validEmailId,
			extraProperty: 'should be ignored',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.id).toBe(validEmailId);
			expect('extraProperty' in result.data).toBe(false);
		}
	});
});
