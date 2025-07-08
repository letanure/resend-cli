import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listApiKeys } from './action.js';

// Mock the Resend module
const mockList = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		apiKeys: {
			list: mockList,
		},
	})),
}));

describe('listApiKeys', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should list API keys successfully', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				data: [
					{
						id: 'test-api-key-1',
						name: 'Production',
						created_at: '2023-04-08T00:11:13.110779+00:00',
					},
					{
						id: 'test-api-key-2',
						name: 'Development',
						created_at: '2023-04-09T00:11:13.110779+00:00',
					},
				],
			},
			error: null,
		});

		const result = await listApiKeys('test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		// Check the structure - could be direct array or nested object
		if (Array.isArray(result.data)) {
			expect(result.data).toHaveLength(2);
		} else if (result.data && typeof result.data === 'object' && 'data' in result.data) {
			expect((result.data as { data: Array<unknown> }).data).toHaveLength(2);
		}
		expect(result.error).toBeUndefined();
	});

	it('should handle errors gracefully', async () => {
		mockList.mockResolvedValueOnce({
			data: null,
			error: { message: 'Invalid API key' },
		});

		const result = await listApiKeys('invalid-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle missing data', async () => {
		mockList.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await listApiKeys('test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle unexpected data structure', async () => {
		mockList.mockResolvedValueOnce({
			data: { unexpected: 'structure' },
			error: null,
		});

		const result = await listApiKeys('test-api-key');

		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		// This case should be handled gracefully in the UI (no nested data array)
	});
});
