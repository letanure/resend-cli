import type { CreateEmailOptions } from 'resend';
import { describe, expect, it } from 'vitest';
import { sendEmailAction } from './action.js';

describe('sendEmailAction', () => {
	const testEmailData: CreateEmailOptions = {
		to: 'test@example.com',
		from: 'sender@example.com',
		subject: 'Test Subject',
		text: 'Test message',
	};

	it('returns success result structure', async () => {
		const result = await sendEmailAction(testEmailData, 'test-api-key');

		expect(result).toHaveProperty('success');
		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.data?.id).toBe('test-email-id');
	});

	it('accepts CreateEmailOptions interface', async () => {
		const emailData: CreateEmailOptions = {
			to: ['user1@example.com', 'user2@example.com'],
			from: 'sender@example.com',
			subject: 'Test',
			html: '<p>Hello</p>',
			text: 'Hello',
		};

		const result = await sendEmailAction(emailData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('requires api key parameter', async () => {
		// Function should accept any string as API key
		const result = await sendEmailAction(testEmailData, 'any-key');
		expect(result).toBeDefined();
	});

	it('handles complex email data', async () => {
		const complexEmailData: CreateEmailOptions = {
			to: 'test@example.com',
			from: 'sender@example.com',
			subject: 'Test',
			html: '<h1>Hello</h1>',
			headers: { 'X-Test': 'value' },
			attachments: [
				{
					content: 'base64content',
					filename: 'test.txt',
				},
			],
		};

		const result = await sendEmailAction(complexEmailData, 'test-api-key');
		expect(result.success).toBe(true);
	});

	it('returns correct ApiResult type', async () => {
		const result = await sendEmailAction(testEmailData, 'test-api-key');

		// Test ApiResult structure
		if (result.success && result.data) {
			expect(result).toHaveProperty('data');
			expect(result.data).toHaveProperty('id');
			expect(typeof result.data.id).toBe('string');
		} else {
			expect(result).toHaveProperty('error');
			expect(typeof result.error).toBe('string');
		}
	});
});
