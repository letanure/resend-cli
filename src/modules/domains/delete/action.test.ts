import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteDomain } from './action.js';

// Mock the Resend module
const mockRemove = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		domains: {
			remove: mockRemove,
		},
	})),
}));

describe('deleteDomain', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should delete domain successfully', async () => {
		mockRemove.mockResolvedValueOnce({
			data: {
				object: 'domain',
				id: 'd91cd9bd-1176-453e-8fc1-35364d380206',
				deleted: true,
			},
			error: null,
		});

		const result = await deleteDomain(
			{
				domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		expect(result.data?.object).toBe('domain');
		expect(result.data?.deleted).toBe(true);
		expect(result.error).toBeUndefined();
		expect(mockRemove).toHaveBeenCalledWith('d91cd9bd-1176-453e-8fc1-35364d380206');
	});

	it('should handle errors gracefully', async () => {
		mockRemove.mockResolvedValueOnce({
			error: { message: 'Domain not found' },
		});

		const result = await deleteDomain(
			{
				domainId: 'invalid-id',
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

		const result = await deleteDomain(
			{
				domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockRemove.mockRejectedValueOnce(new Error('Network error'));

		const result = await deleteDomain(
			{
				domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
