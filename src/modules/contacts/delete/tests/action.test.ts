import { describe, expect, it } from 'vitest';
import { deleteContact } from '../action.js';
import type { DeleteContactOptionsType } from '../schema.js';

describe('deleteContact', () => {
	const testContactData: DeleteContactOptionsType = {
		audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		id: '479e3145-dd38-476b-932c-529ceb705947',
	};

	it('returns success result structure', async () => {
		const result = await deleteContact(testContactData, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.contact).toBe('test-contact-id');
	});

	it('accepts valid contact data with ID', async () => {
		const contactData: DeleteContactOptionsType = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		const result = await deleteContact(contactData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('accepts valid contact data with email', async () => {
		const contactData: DeleteContactOptionsType = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'contact@example.com',
		};

		const result = await deleteContact(contactData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('accepts valid contact data with both ID and email', async () => {
		const contactData: DeleteContactOptionsType = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '479e3145-dd38-476b-932c-529ceb705947',
			email: 'contact@example.com',
		};

		const result = await deleteContact(contactData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('requires api key parameter', async () => {
		// Function should accept any string as API key
		const result = await deleteContact(testContactData, 'any-key');
		expect(result).toBeDefined();
	});

	it('handles different audience and contact IDs', async () => {
		const testData = [
			{
				audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: '479e3145-dd38-476b-932c-529ceb705947',
			},
			{
				audience_id: '12345678-1234-1234-1234-123456789abc',
				email: 'user@example.com',
			},
			{
				audience_id: '87654321-4321-4321-4321-cba987654321',
				id: '11111111-1111-1111-1111-111111111111',
			},
		];

		for (const contactData of testData) {
			const result = await deleteContact(contactData, 'test-api-key');
			expect(result.success).toBe(true);
		}
	});

	it('returns consistent interface regardless of input', async () => {
		const result = await deleteContact(testContactData, 'test-key');

		// Should always return ApiResult interface
		expect(typeof result.success).toBe('boolean');
		if (result.success) {
			expect(result.data).toBeDefined();
		} else {
			expect(result.error).toBeDefined();
		}
	});

	it('handles email-only deletion', async () => {
		const contactData: DeleteContactOptionsType = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'test@example.com',
		};

		const result = await deleteContact(contactData, 'test-api-key');
		expect(result.success).toBe(true);
	});
});
