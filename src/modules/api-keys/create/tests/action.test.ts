import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApiKey } from '../action.js';

// Mock the Resend module
const mockCreate = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		apiKeys: {
			create: mockCreate,
		},
	})),
}));

describe('createApiKey', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create an API key successfully with full_access', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: 'test-api-key-id',
				token: 're_test_token',
			},
			error: null,
		});

		const result = await createApiKey(
			{
				name: 'Test API Key',
				permission: 'full_access',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.error).toBeUndefined();
	});

	it('should create an API key successfully with sending_access and domain_id', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: 'test-api-key-id',
				token: 're_test_token',
			},
			error: null,
		});

		const result = await createApiKey(
			{
				name: 'Test API Key',
				permission: 'sending_access',
				domain_id: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();
		expect(result.error).toBeUndefined();
	});

	it('should handle errors gracefully', async () => {
		mockCreate.mockResolvedValueOnce({
			data: null,
			error: { message: 'Invalid API key' },
		});

		const result = await createApiKey(
			{
				name: 'Test API Key',
				permission: 'full_access',
			},
			'invalid-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBe('Invalid API key');
		expect(result.data).toBeUndefined();
	});
});
