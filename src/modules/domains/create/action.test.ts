import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDomain } from './action.js';

// Mock the Resend module
const mockCreate = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		domains: {
			create: mockCreate,
		},
	})),
}));

describe('createDomain', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create domain successfully', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
				name: 'example.com',
				created_at: '2023-03-28T17:12:02.059593+00:00',
				status: 'not_started',
				region: 'us-east-1',
				records: [
					{
						record: 'SPF',
						name: 'send',
						type: 'MX',
						ttl: 'Auto',
						status: 'not_started',
						value: 'feedback-smtp.us-east-1.amazonses.com',
						priority: 10,
					},
				],
			},
			error: null,
		});

		const result = await createDomain(
			{
				name: 'example.com',
				region: 'us-east-1',
				custom_return_path: 'send',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('4dd369bc-aa82-4ff3-97de-514ae3000ee0');
		expect(result.data?.name).toBe('example.com');
		expect(result.data?.region).toBe('us-east-1');
		expect(result.data?.status).toBe('not_started');
		expect(result.error).toBeUndefined();
		expect(mockCreate).toHaveBeenCalledWith({
			name: 'example.com',
			region: 'us-east-1',
			customReturnPath: 'send',
		});
	});

	it('should handle errors gracefully', async () => {
		mockCreate.mockResolvedValueOnce({
			error: { message: 'Domain already exists' },
		});

		const result = await createDomain(
			{
				name: 'existing.com',
			},
			'invalid-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockCreate.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await createDomain(
			{
				name: 'example.com',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockCreate.mockRejectedValueOnce(new Error('Network error'));

		const result = await createDomain(
			{
				name: 'example.com',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should use default values for optional fields', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: '4dd369bc-aa82-4ff3-97de-514ae3000ee0',
				name: 'example.com',
				created_at: '2023-03-28T17:12:02.059593+00:00',
				status: 'not_started',
				region: 'us-east-1',
				records: [],
			},
			error: null,
		});

		const result = await createDomain(
			{
				name: 'example.com',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockCreate).toHaveBeenCalledWith({
			name: 'example.com',
			region: 'us-east-1',
			customReturnPath: 'send',
		});
	});
});
