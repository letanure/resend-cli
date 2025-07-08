import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteApiKey } from './action.js';

// Mock the Resend module
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
			error: null,
		});

		const result = await deleteApiKey('test-api-key', {
			api_key_id: 'test-key-id-123',
		});

		expect(result.success).toBe(true);
		expect(result.data?.message).toContain('test-key-id-123');
		expect(result.data?.message).toContain('deleted successfully');
		expect(result.error).toBeUndefined();
		expect(mockRemove).toHaveBeenCalledWith('test-key-id-123');
	});

	it('should handle errors gracefully', async () => {
		mockRemove.mockResolvedValueOnce({
			error: { message: 'API key not found' },
		});

		const result = await deleteApiKey('invalid-key', {
			api_key_id: 'non-existent-key',
		});

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockRemove.mockRejectedValueOnce(new Error('Network error'));

		const result = await deleteApiKey('test-api-key', {
			api_key_id: 'test-key-id',
		});

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
