import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listDomains } from '../action.js';

// Mock the Resend module
const mockList = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		domains: {
			list: mockList,
		},
	})),
}));

describe('listDomains', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should list domains successfully', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				data: [
					{
						id: 'd91cd9bd-1176-453e-8fc1-35364d380206',
						name: 'example.com',
						status: 'verified',
						created_at: '2023-04-26T20:21:26.347412+00:00',
						region: 'us-east-1',
					},
					{
						id: 'd91cd9bd-1176-453e-8fc1-35364d380207',
						name: 'test.com',
						status: 'pending',
						created_at: '2023-04-26T20:21:26.347412+00:00',
						region: 'eu-west-1',
					},
				],
			},
			error: null,
		});

		const result = await listDomains({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.data).toHaveLength(2);
		expect(result.data?.data[0]?.id).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		expect(result.data?.data[0]?.name).toBe('example.com');
		expect(result.data?.data[0]?.status).toBe('verified');
		expect(result.data?.data[1]?.name).toBe('test.com');
		expect(result.error).toBeUndefined();
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle empty domains list', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				data: [],
			},
			error: null,
		});

		const result = await listDomains({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.data).toHaveLength(0);
		expect(result.error).toBeUndefined();
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle errors gracefully', async () => {
		mockList.mockResolvedValueOnce({
			error: { message: 'API Error' },
		});

		const result = await listDomains({}, 'invalid-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockList.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await listDomains({}, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockList.mockRejectedValueOnce(new Error('Network error'));

		const result = await listDomains({}, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
