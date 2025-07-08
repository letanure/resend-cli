import type { Resend } from 'resend';
import { describe, expect, it, vi } from 'vitest';
import { listContacts } from '../action.js';

// Mock the Resend SDK
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		contacts: {
			list: vi.fn(),
		},
	})),
}));

describe('Contact List Action', () => {
	it('should return success result when contacts are listed successfully', async () => {
		const { Resend } = await import('resend');
		const mockList = vi.fn().mockResolvedValue({
			data: {
				object: 'list',
				data: [
					{
						id: 'contact-123',
						email: 'test@example.com',
						first_name: 'John',
						last_name: 'Doe',
						created_at: '2023-01-01T00:00:00Z',
						unsubscribed: false,
					},
					{
						id: 'contact-456',
						email: 'user@example.com',
						first_name: 'Jane',
						last_name: 'Smith',
						created_at: '2023-01-02T00:00:00Z',
						unsubscribed: true,
					},
				],
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { list: mockList },
				}) as unknown as Resend,
		);

		const listData = {
			audience_id: 'audience-123',
		};

		const result = await listContacts(listData, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			object: 'list',
			data: [
				{
					id: 'contact-123',
					email: 'test@example.com',
					first_name: 'John',
					last_name: 'Doe',
					created_at: '2023-01-01T00:00:00Z',
					unsubscribed: false,
				},
				{
					id: 'contact-456',
					email: 'user@example.com',
					first_name: 'Jane',
					last_name: 'Smith',
					created_at: '2023-01-02T00:00:00Z',
					unsubscribed: true,
				},
			],
		});
		expect(mockList).toHaveBeenCalledWith({
			audienceId: 'audience-123',
		});
	});

	it('should return success result when contacts list is empty', async () => {
		const { Resend } = await import('resend');
		const mockList = vi.fn().mockResolvedValue({
			data: {
				object: 'list',
				data: [],
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { list: mockList },
				}) as unknown as Resend,
		);

		const listData = {
			audience_id: 'audience-123',
		};

		const result = await listContacts(listData, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			object: 'list',
			data: [],
		});
		expect(mockList).toHaveBeenCalledWith({
			audienceId: 'audience-123',
		});
	});

	it('should return error result when API returns error', async () => {
		const { Resend } = await import('resend');
		const mockList = vi.fn().mockResolvedValue({
			data: null,
			error: { message: 'Audience not found' },
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { list: mockList },
				}) as unknown as Resend,
		);

		const listData = {
			audience_id: 'invalid-audience-id',
		};

		const result = await listContacts(listData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Audience not found');
	});

	it('should return error result when API throws exception', async () => {
		const { Resend } = await import('resend');
		const mockList = vi.fn().mockRejectedValue(new Error('Network error'));
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { list: mockList },
				}) as unknown as Resend,
		);

		const listData = {
			audience_id: 'audience-123',
		};

		const result = await listContacts(listData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('Network error');
	});

	it('should return error result when no data returned', async () => {
		const { Resend } = await import('resend');
		const mockList = vi.fn().mockResolvedValue({
			data: null,
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { list: mockList },
				}) as unknown as Resend,
		);

		const listData = {
			audience_id: 'audience-123',
		};

		const result = await listContacts(listData, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toContain('No data returned from API');
	});

	it('should call Resend API with correct parameters', async () => {
		const { Resend } = await import('resend');
		const mockList = vi.fn().mockResolvedValue({
			data: {
				object: 'list',
				data: [
					{
						id: 'contact-123',
						email: 'test@example.com',
						first_name: 'John',
						last_name: 'Doe',
						created_at: '2023-01-01T00:00:00Z',
						unsubscribed: false,
					},
				],
			},
			error: null,
		});
		vi.mocked(Resend).mockImplementation(
			() =>
				({
					contacts: { list: mockList },
				}) as unknown as Resend,
		);

		const listData = {
			audience_id: 'audience-123',
		};

		await listContacts(listData, 'test-api-key');

		expect(mockList).toHaveBeenCalledWith({
			audienceId: 'audience-123',
		});
	});
});
