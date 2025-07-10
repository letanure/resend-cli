import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteApiKey } from '../action.js';

const mockRemove = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		apiKeys: {
			remove: mockRemove,
		},
	})),
}));

describe('deleteApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should delete API key successfully', async () => {
		mockRemove.mockResolvedValueOnce({
			data: {},
			error: null,
		});

		const result = await deleteApiKey(
			{
				api_key_id: 'test-key-id-123',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data).toEqual({});
		expect(result.error).toBeUndefined();
		expect(mockRemove).toHaveBeenCalledWith('test-key-id-123');
	});

	it('should handle errors gracefully', async () => {
		mockRemove.mockResolvedValueOnce({
			error: { message: 'API key not found' },
		});

		const result = await deleteApiKey(
			{
				api_key_id: 'non-existent-key',
			},
			'invalid-key',
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

		const result = await deleteApiKey(
			{
				api_key_id: 'test-key-id',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockRemove.mockRejectedValueOnce(new Error('Network error'));

		const result = await deleteApiKey(
			{
				api_key_id: 'test-key-id',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
