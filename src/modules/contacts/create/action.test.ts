import { describe, expect, it, vi } from 'vitest';
import type { Resend } from 'resend';
import { createContact } from './action.js';

// Mock the Resend SDK
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		contacts: {
			create: vi.fn(),
		},
	})),
}));

describe('Contact Create Action', () => {
	it('should return success result when contact is created successfully', async () => {
		const { Resend } = await import('resend');
		const mockCreate = vi.fn().mockResolvedValue({
			data: { object: 'contact', id: 'contact-123' },
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { create: mockCreate },
				}) as unknown as Resend,
		);

		const contactData = {
			email: 'test@example.com',
			audience_id: 'audience-123',
			first_name: 'John',
			last_name: 'Doe',
			unsubscribed: false,
		};

		const result = await createContact(contactData, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toEqual({ object: 'contact', id: 'contact-123' });
		expect(mockCreate).toHaveBeenCalledWith({
			email: 'test@example.com',
			audienceId: 'audience-123',
			firstName: 'John',
			lastName: 'Doe',
			unsubscribed: false,
		});
	});

	it('should return error result when API returns error', async () => {
		const { Resend } = await import('resend');
		const mockCreate = vi.fn().mockResolvedValue({
			data: null,
			error: { message: 'Invalid audience ID' },
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { create: mockCreate },
				}) as unknown as Resend,
		);

		const contactData = {
			email: 'test@example.com',
			audience_id: 'invalid-audience',
			unsubscribed: false,
		};

		const result = await createContact(contactData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Invalid audience ID');
	});

	it('should return error result when API throws exception', async () => {
		const { Resend } = await import('resend');
		const mockCreate = vi.fn().mockRejectedValue(new Error('Network error'));
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { create: mockCreate },
				}) as unknown as Resend,
		);

		const contactData = {
			email: 'test@example.com',
			audience_id: 'audience-123',
			unsubscribed: false,
		};

		const result = await createContact(contactData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Network error');
	});

	it('should return error result when no data returned', async () => {
		const { Resend } = await import('resend');
		const mockCreate = vi.fn().mockResolvedValue({
			data: null,
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { create: mockCreate },
				}) as unknown as Resend,
		);

		const contactData = {
			email: 'test@example.com',
			audience_id: 'audience-123',
			unsubscribed: false,
		};

		const result = await createContact(contactData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('No data returned from API');
	});

	it('should call Resend API with correct field mapping', async () => {
		const { Resend } = await import('resend');
		const mockCreate = vi.fn().mockResolvedValue({
			data: { object: 'contact', id: 'contact-123' },
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { create: mockCreate },
				}) as unknown as Resend,
		);

		const contactData = {
			email: 'test@example.com',
			audience_id: 'audience-123',
			first_name: 'Steve',
			last_name: 'Wozniak',
			unsubscribed: true,
		};

		await createContact(contactData, 'test-api-key');

		expect(mockCreate).toHaveBeenCalledWith({
			email: 'test@example.com',
			audienceId: 'audience-123',
			firstName: 'Steve',
			lastName: 'Wozniak',
			unsubscribed: true,
		});
	});
});
