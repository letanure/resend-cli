import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyDomain } from '../action.js';

// Mock the Resend module
const mockVerify = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		domains: {
			verify: mockVerify,
		},
	})),
}));

describe('verifyDomain', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should verify domain successfully', async () => {
		mockVerify.mockResolvedValueOnce({
			data: {
				object: 'domain',
				id: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			error: null,
		});

		const result = await verifyDomain(
			{
				domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		expect(result.data?.object).toBe('domain');
		expect(result.error).toBeUndefined();
		expect(mockVerify).toHaveBeenCalledWith('d91cd9bd-1176-453e-8fc1-35364d380206');
	});

	it('should handle errors gracefully', async () => {
		mockVerify.mockResolvedValueOnce({
			error: { message: 'Domain not found' },
		});

		const result = await verifyDomain(
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
		mockVerify.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await verifyDomain(
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
		mockVerify.mockRejectedValueOnce(new Error('Network error'));

		const result = await verifyDomain(
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
