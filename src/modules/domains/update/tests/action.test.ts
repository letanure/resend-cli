import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateDomain } from '../action.js';

// Mock the Resend module
const mockUpdate = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		domains: {
			update: mockUpdate,
		},
	})),
}));

describe('updateDomain', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should update domain successfully with all parameters', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				object: 'domain',
				id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			},
			error: null,
		});

		const result = await updateDomain(
			{
				domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
				clickTracking: true,
				openTracking: false,
				tls: 'enforced',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('b8617ad3-b712-41d9-81a0-f7c3d879314e');
		expect(result.data?.object).toBe('domain');
		expect(result.error).toBeUndefined();
		expect(mockUpdate).toHaveBeenCalledWith({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			clickTracking: true,
			openTracking: false,
			tls: 'enforced',
		});
	});

	it('should update domain with only some parameters', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				object: 'domain',
				id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			},
			error: null,
		});

		const result = await updateDomain(
			{
				domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
				clickTracking: true,
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockUpdate).toHaveBeenCalledWith({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			id: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			clickTracking: true,
		});
	});

	it('should handle errors gracefully', async () => {
		mockUpdate.mockResolvedValueOnce({
			error: { message: 'Domain not found' },
		});

		const result = await updateDomain(
			{
				domainId: 'invalid-id',
				clickTracking: true,
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await updateDomain(
			{
				domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
				clickTracking: true,
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockUpdate.mockRejectedValueOnce(new Error('Network error'));

		const result = await updateDomain(
			{
				domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
				clickTracking: true,
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
