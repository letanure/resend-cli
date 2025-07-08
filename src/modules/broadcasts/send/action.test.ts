import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sendBroadcast } from './action.js';

// Mock the Resend module
const mockSend = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		broadcasts: {
			send: mockSend,
		},
	})),
}));

describe('sendBroadcast', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should send broadcast successfully with only required parameter', async () => {
		mockSend.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await sendBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		expect(result.error).toBeUndefined();
		expect(mockSend).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {});
	});

	it('should send broadcast successfully with scheduledAt parameter', async () => {
		mockSend.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await sendBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				scheduledAt: 'in 1 min',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		expect(result.error).toBeUndefined();
		expect(mockSend).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {
			scheduledAt: 'in 1 min',
		});
	});

	it('should send broadcast successfully with ISO 8601 scheduledAt format', async () => {
		mockSend.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await sendBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
				scheduledAt: '2024-08-05T11:52:01.858Z',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		expect(result.error).toBeUndefined();
		expect(mockSend).toHaveBeenCalledWith('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794', {
			scheduledAt: '2024-08-05T11:52:01.858Z',
		});
	});

	it('should handle errors gracefully', async () => {
		mockSend.mockResolvedValueOnce({
			error: { message: 'Broadcast not found' },
		});

		const result = await sendBroadcast(
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
		mockSend.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await sendBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockSend.mockRejectedValueOnce(new Error('Network error'));

		const result = await sendBroadcast(
			{
				broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
