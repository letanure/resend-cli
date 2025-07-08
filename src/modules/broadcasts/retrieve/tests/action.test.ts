import { beforeEach, describe, expect, it, vi } from 'vitest';
import { retrieveBroadcast } from '../action.js';

// Mock the Resend module
const mockGet = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		broadcasts: {
			get: mockGet,
		},
	})),
}));

describe('retrieveBroadcast', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should retrieve broadcast successfully', async () => {
		mockGet.mockResolvedValueOnce({
			data: {
				object: 'broadcast',
				id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
				name: 'Announcements',
				audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Acme <onboarding@resend.dev>',
				subject: 'hello world',
				reply_to: null,
				preview_text: 'Check out our latest announcements',
				status: 'draft',
				created_at: '2024-12-01T19:32:22.980Z',
				scheduled_at: null,
				sent_at: null,
			},
			error: null,
		});

		const result = await retrieveBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		expect(result.data?.object).toBe('broadcast');
		expect(result.data?.name).toBe('Announcements');
		expect(result.data?.status).toBe('draft');
		expect(result.error).toBeUndefined();
		expect(mockGet).toHaveBeenCalledWith('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
	});

	it('should retrieve broadcast with sent status', async () => {
		mockGet.mockResolvedValueOnce({
			data: {
				object: 'broadcast',
				id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
				name: 'Campaign',
				audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Test <test@example.com>',
				subject: 'Test Campaign',
				reply_to: ['reply@example.com'],
				preview_text: 'Test preview',
				status: 'sent',
				created_at: '2024-12-01T19:32:22.980Z',
				scheduled_at: null,
				sent_at: '2024-12-01T20:00:00.000Z',
			},
			error: null,
		});

		const result = await retrieveBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.status).toBe('sent');
		expect(result.data?.reply_to).toEqual(['reply@example.com']);
		expect(result.data?.sent_at).toBe('2024-12-01T20:00:00.000Z');
	});

	it('should retrieve broadcast with queued status', async () => {
		mockGet.mockResolvedValueOnce({
			data: {
				object: 'broadcast',
				id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
				name: null,
				audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Test <test@example.com>',
				subject: 'Scheduled Campaign',
				reply_to: null,
				preview_text: null,
				status: 'queued',
				created_at: '2024-12-01T19:32:22.980Z',
				scheduled_at: '2024-12-01T21:00:00.000Z',
				sent_at: null,
			},
			error: null,
		});

		const result = await retrieveBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.status).toBe('queued');
		expect(result.data?.name).toBe(null);
		expect(result.data?.scheduled_at).toBe('2024-12-01T21:00:00.000Z');
	});

	it('should handle errors gracefully', async () => {
		mockGet.mockResolvedValueOnce({
			error: { message: 'Broadcast not found' },
		});

		const result = await retrieveBroadcast(
			{
				broadcastId: 'invalid-id',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockGet.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await retrieveBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockGet.mockRejectedValueOnce(new Error('Network error'));

		const result = await retrieveBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
