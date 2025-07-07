import { vi } from 'vitest';

// Mock RESEND_API_KEY for all tests
vi.stubEnv('RESEND_API_KEY', 'test-api-key');

// Mock the email send action
vi.mock('./modules/emails/send/action.js', () => ({
	sendEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id' },
		}),
	),
}));
