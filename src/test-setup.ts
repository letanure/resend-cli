import { vi } from 'vitest';

vi.stubEnv('RESEND_API_KEY', 'test-api-key');

vi.mock('./modules/emails/send/action.js', () => ({
	sendEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id' },
		}),
	),
}));

vi.mock('./modules/emails/retrieve/action.js', () => ({
	getEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id' },
		}),
	),
}));

vi.mock('./modules/emails/update/action.js', () => ({
	updateEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id', object: 'email' },
		}),
	),
}));

vi.mock('./modules/emails/cancel/action.js', () => ({
	cancelEmail: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: { id: 'test-email-id', object: 'email' },
		}),
	),
}));

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

vi.mock('./modules/contacts/delete/action.js', () => ({
	deleteContact: vi.fn(() =>
		Promise.resolve({
			success: true,
			data: {
				object: 'contact',
				contact: 'test-contact-id',
				deleted: true,
			},
		}),
	),
}));
