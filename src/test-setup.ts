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

// Mock the email retrieve action
vi.mock('./modules/emails/retrieve/action.js', () => ({
	getEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id' },
		}),
	),
}));

// Mock the email update action
vi.mock('./modules/emails/update/action.js', () => ({
	updateEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id', object: 'email' },
		}),
	),
}));

// Mock the email cancel action
vi.mock('./modules/emails/cancel/action.js', () => ({
	cancelEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id', object: 'email' },
		}),
	),
}));

// Mock the audience create action
vi.mock('./modules/audiences/create/action.js', () => ({
	createAudience: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: {
				id: 'test-audience-id',
				object: 'audience',
				name: 'Test Audience',
			},
		}),
	),
}));
