import { beforeEach, describe, expect, it, vi } from 'vitest';
import { retrieveDomain } from './action.js';

// Mock the Resend module
const mockGet = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		domains: {
			get: mockGet,
		},
	})),
}));

describe('retrieveDomain', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should retrieve domain successfully', async () => {
		mockGet.mockResolvedValueOnce({
			data: {
				object: 'domain',
				id: 'd91cd9bd-1176-453e-8fc1-35364d380206',
				name: 'example.com',
				status: 'verified',
				created_at: '2023-04-26T20:21:26.347412+00:00',
				region: 'us-east-1',
				records: [
					{
						record: 'SPF',
						name: 'send',
						type: 'MX',
						ttl: 'Auto',
						status: 'verified',
						value: 'feedback-smtp.us-east-1.amazonses.com',
						priority: 10,
					},
				],
			},
			error: null,
		});

		const result = await retrieveDomain(
			{
				domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		expect(result.data?.name).toBe('example.com');
		expect(result.data?.status).toBe('verified');
		expect(result.data?.region).toBe('us-east-1');
		expect(result.data?.records).toHaveLength(1);
		expect(result.error).toBeUndefined();
		expect(mockGet).toHaveBeenCalledWith('d91cd9bd-1176-453e-8fc1-35364d380206');
	});

	it('should handle errors gracefully', async () => {
		mockGet.mockResolvedValueOnce({
			error: { message: 'Domain not found' },
		});

		const result = await retrieveDomain(
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
		mockGet.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await retrieveDomain(
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
		mockGet.mockRejectedValueOnce(new Error('Network error'));

		const result = await retrieveDomain(
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
