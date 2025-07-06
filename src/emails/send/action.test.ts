import { describe, expect, it, vi } from 'vitest';
import { sendEmailAction } from './action.js';

// Mock the Resend SDK
const mockSend = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		emails: {
			send: mockSend,
		},
	})),
}));

describe('sendEmailAction', () => {
	const testEmailData = {
		to: 'test@example.com',
		from: 'sender@example.com',
		subject: 'Test Subject',
		html: '<p>Test content</p>',
	};

	it('should return success ApiResult with correct data structure when Resend succeeds', async () => {
		const mockResponseData = { id: 'email-123' };
		mockSend.mockResolvedValue({
			data: mockResponseData,
			error: null,
		});

		const result = await sendEmailAction(testEmailData, 'test-api-key');

		expect(result).toEqual({
			success: true,
			data: mockResponseData,
		});
	});

	it('should return error ApiResult with formatted error when Resend returns error', async () => {
		const resendError = {
			message: 'Invalid from address',
			name: 'invalid_from_address',
		};
		mockSend.mockResolvedValue({
			data: null,
			error: resendError,
		});

		const result = await sendEmailAction(testEmailData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Failed to send email');
		expect(result.error).toContain('Invalid from address');
		expect(result.error).toContain('Suggestion:');
		expect(result.error).toContain('Request data:');
		expect(result.error).toContain('Request response');
	});

	it('should handle network/exception errors and format them properly', async () => {
		const networkError = new Error('Network timeout');
		mockSend.mockRejectedValue(networkError);

		const result = await sendEmailAction(testEmailData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Failed to send email');
		expect(result.error).toContain('Network timeout');
		expect(result.error).toContain('Request data:');
	});

	it('should include request data in error messages for debugging', async () => {
		const resendError = {
			message: 'Validation failed',
			name: 'validation_error',
		};
		mockSend.mockResolvedValue({
			data: null,
			error: resendError,
		});

		const result = await sendEmailAction(testEmailData, 'test-api-key');

		expect(result.error).toContain(JSON.stringify(testEmailData, null, 2));
		expect(result.error).toContain('"to": "test@example.com"');
		expect(result.error).toContain('"from": "sender@example.com"');
	});

	it('should handle unknown error types gracefully', async () => {
		const unknownError = {
			message: 'Some new error type',
			name: 'new_error_type_not_in_our_map',
		};
		mockSend.mockResolvedValue({
			data: null,
			error: unknownError,
		});

		const result = await sendEmailAction(testEmailData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Failed to send email');
		expect(result.error).toContain('Some new error type');
		// Should fall back to unknown_error suggestion
		expect(result.error).toContain('Please try again or contact support');
	});
});
