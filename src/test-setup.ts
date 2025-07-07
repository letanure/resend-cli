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

// Mock the audience retrieve action
vi.mock('./modules/audiences/retrieve/action.js', () => ({
	retrieveAudience: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: {
				id: 'test-audience-id',
				object: 'audience',
				name: 'Test Audience',
				created_at: '2023-10-06T22:59:55.977Z',
			},
		}),
	),
}));

// Mock the audience delete action
vi.mock('./modules/audiences/delete/action.js', () => ({
	deleteAudience: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: {
				id: 'test-audience-id',
				object: 'audience',
				deleted: true,
			},
		}),
	),
}));

// Mock the audience list action
vi.mock('./modules/audiences/list/action.js', () => ({
	listAudiences: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: {
				object: 'list',
				data: [
					{
						id: 'test-audience-1',
						name: 'Test Audience 1',
						created_at: '2023-10-06T22:59:55.977Z',
					},
					{
						id: 'test-audience-2',
						name: 'Test Audience 2',
						created_at: '2023-10-07T10:30:12.123Z',
					},
				],
			},
		}),
	),
}));
