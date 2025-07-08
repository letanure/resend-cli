import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteBroadcast } from './action.js';

// Mock the Resend module
const mockRemove = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		broadcasts: {
			remove: mockRemove,
		},
	})),
}));

describe('deleteBroadcast', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should delete broadcast successfully', async () => {
		mockRemove.mockResolvedValueOnce({
			data: {
				object: 'broadcast',
				id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
				deleted: true,
			},
			error: null,
		});

		const result = await deleteBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('broadcast');
		expect(result.data?.id).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		expect(result.data?.deleted).toBe(true);
		expect(result.error).toBeUndefined();
		expect(mockRemove).toHaveBeenCalledWith('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
	});

	it('should handle scheduled broadcast deletion (cancels delivery)', async () => {
		mockRemove.mockResolvedValueOnce({
			data: {
				object: 'broadcast',
				id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
				deleted: true,
			},
			error: null,
		});

		const result = await deleteBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('broadcast');
		expect(result.data?.id).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		expect(result.data?.deleted).toBe(true);
		expect(result.error).toBeUndefined();
		expect(mockRemove).toHaveBeenCalledWith('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
	});

	it('should handle draft broadcast deletion', async () => {
		mockRemove.mockResolvedValueOnce({
			data: {
				object: 'broadcast',
				id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
				deleted: true,
			},
			error: null,
		});

		const result = await deleteBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('broadcast');
		expect(result.data?.id).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		expect(result.data?.deleted).toBe(true);
		expect(result.error).toBeUndefined();
		expect(mockRemove).toHaveBeenCalledWith('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
	});

	it('should handle errors gracefully', async () => {
		mockRemove.mockResolvedValueOnce({
			error: { message: 'Broadcast not found or cannot be deleted' },
		});

		const result = await deleteBroadcast(
			{
				broadcastId: 'invalid-id',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle broadcasts that cannot be deleted (already sent)', async () => {
		mockRemove.mockResolvedValueOnce({
			error: { message: 'Broadcast has already been sent and cannot be deleted' },
		});

		const result = await deleteBroadcast(
			{
				broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockRemove.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await deleteBroadcast(
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
		mockRemove.mockRejectedValueOnce(new Error('Network error'));

		const result = await deleteBroadcast(
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
