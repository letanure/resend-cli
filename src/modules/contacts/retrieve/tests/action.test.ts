import type { Resend } from 'resend';
import { describe, expect, it, vi } from 'vitest';
import { retrieveContact } from '../action.js';

// Mock the Resend SDK
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		contacts: {
			get: vi.fn(),
		},
	})),
}));

describe('Contact Retrieve Action', () => {
	it('should return success result when contact is retrieved successfully by ID', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockResolvedValue({
			data: {
				object: 'contact',
				id: 'contact-123',
				email: 'test@example.com',
				first_name: 'John',
				last_name: 'Doe',
				created_at: '2023-01-01T00:00:00Z',
				unsubscribed: false,
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			id: 'contact-123',
		};

		const result = await retrieveContact(contactData, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			object: 'contact',
			id: 'contact-123',
			email: 'test@example.com',
			first_name: 'John',
			last_name: 'Doe',
			created_at: '2023-01-01T00:00:00Z',
			unsubscribed: false,
		});
		expect(mockGet).toHaveBeenCalledWith({
			audienceId: 'audience-123',
			id: 'contact-123',
			email: undefined,
		});
	});

	it('should return success result when contact is retrieved successfully by email', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockResolvedValue({
			data: {
				object: 'contact',
				id: 'contact-456',
				email: 'user@example.com',
				first_name: 'Jane',
				last_name: 'Smith',
				created_at: '2023-01-01T00:00:00Z',
				unsubscribed: true,
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			email: 'user@example.com',
		};

		const result = await retrieveContact(contactData, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			object: 'contact',
			id: 'contact-456',
			email: 'user@example.com',
			first_name: 'Jane',
			last_name: 'Smith',
			created_at: '2023-01-01T00:00:00Z',
			unsubscribed: true,
		});
		expect(mockGet).toHaveBeenCalledWith({
			audienceId: 'audience-123',
			id: undefined,
			email: 'user@example.com',
		});
	});

	it('should return error result when API returns error', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockResolvedValue({
			data: null,
			error: { message: 'Contact not found' },
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			id: 'invalid-contact-id',
		};

		const result = await retrieveContact(contactData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Contact not found');
	});

	it('should return error result when API throws exception', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockRejectedValue(new Error('Network error'));
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			id: 'contact-123',
		};

		const result = await retrieveContact(contactData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Network error');
	});

	it('should return error result when no data returned', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockResolvedValue({
			data: null,
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			id: 'contact-123',
		};

		const result = await retrieveContact(contactData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('No data returned from API');
	});

	it('should call Resend API with correct parameters for ID retrieval', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockResolvedValue({
			data: {
				object: 'contact',
				id: 'contact-123',
				email: 'test@example.com',
				created_at: '2023-01-01T00:00:00Z',
				unsubscribed: false,
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			id: 'contact-123',
		};

		await retrieveContact(contactData, 'test-api-key');

		expect(mockGet).toHaveBeenCalledWith({
			audienceId: 'audience-123',
			id: 'contact-123',
			email: undefined,
		});
	});

	it('should call Resend API with correct parameters for email retrieval', async () => {
		const { Resend } = await import('resend');
		const mockGet = vi.fn().mockResolvedValue({
			data: {
				object: 'contact',
				id: 'contact-456',
				email: 'user@example.com',
				created_at: '2023-01-01T00:00:00Z',
				unsubscribed: false,
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { get: mockGet },
				}) as unknown as Resend,
		);

		const contactData = {
			audience_id: 'audience-123',
			email: 'user@example.com',
		};

		await retrieveContact(contactData, 'test-api-key');

		expect(mockGet).toHaveBeenCalledWith({
			audienceId: 'audience-123',
			id: undefined,
			email: 'user@example.com',
		});
	});
});
