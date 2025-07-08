import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateBroadcast } from './action.js';

// Mock the Resend module
const mockUpdate = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		broadcasts: {
			update: mockUpdate,
		},
	})),
}));

describe('updateBroadcast', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should update broadcast successfully with all parameters', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await updateBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Acme <onboarding@resend.dev>',
				subject: 'Updated subject',
				replyTo: 'reply@example.com',
				html: '<p>Updated HTML content</p>',
				text: 'Updated text content',
				name: 'Updated Broadcast Name',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		expect(result.error).toBeUndefined();
		expect(mockUpdate).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'Acme <onboarding@resend.dev>',
			subject: 'Updated subject',
			reply_to: ['reply@example.com'],
			html: '<p>Updated HTML content</p>',
			text: 'Updated text content',
			name: 'Updated Broadcast Name',
		});
	});

	it('should update broadcast with only required parameter', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await updateBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockUpdate).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {});
	});

	it('should update broadcast with only some parameters', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await updateBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				subject: 'New subject',
				html: '<p>New HTML content</p>',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockUpdate).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {
			subject: 'New subject',
			html: '<p>New HTML content</p>',
		});
	});

	it('should handle multiple reply-to addresses', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await updateBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				replyTo: 'reply1@example.com, reply2@example.com',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockUpdate).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {
			reply_to: ['reply1@example.com', 'reply2@example.com'],
		});
	});

	it('should handle errors gracefully', async () => {
		mockUpdate.mockResolvedValueOnce({
			error: { message: 'Broadcast not found' },
		});

		const result = await updateBroadcast(
			{
				broadcastId: 'invalid-id',
				subject: 'test',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await updateBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				subject: 'test',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockUpdate.mockRejectedValueOnce(new Error('Network error'));

		const result = await updateBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				subject: 'test',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
