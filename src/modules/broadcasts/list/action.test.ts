import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listBroadcasts } from './action.js';

// Mock the Resend module
const mockList = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		broadcasts: {
			list: mockList,
		},
	})),
}));

describe('listBroadcasts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should list broadcasts successfully', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				object: 'list',
				data: [
					{
						id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
						audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
						status: 'draft',
						created_at: '2024-11-01T15:13:31.723Z',
						scheduled_at: null,
						sent_at: null,
					},
					{
						id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
						audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
						status: 'sent',
						created_at: '2024-12-01T19:32:22.980Z',
						scheduled_at: '2024-12-02T19:32:22.980Z',
						sent_at: '2024-12-02T19:32:22.980Z',
					},
				],
			},
			error: null,
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('list');
		expect(result.data?.data).toHaveLength(2);
		expect(result.data?.data[0]?.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		expect(result.data?.data[0]?.status).toBe('draft');
		expect(result.data?.data[1]?.id).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		expect(result.data?.data[1]?.status).toBe('sent');
		expect(result.error).toBeUndefined();
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle empty broadcast list', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				object: 'list',
				data: [],
			},
			error: null,
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('list');
		expect(result.data?.data).toHaveLength(0);
		expect(result.error).toBeUndefined();
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle draft broadcasts', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				object: 'list',
				data: [
					{
						id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
						audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
						status: 'draft',
						created_at: '2024-11-01T15:13:31.723Z',
						scheduled_at: null,
						sent_at: null,
					},
				],
			},
			error: null,
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.data[0]?.status).toBe('draft');
		expect(result.data?.data[0]?.scheduled_at).toBeNull();
		expect(result.data?.data[0]?.sent_at).toBeNull();
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle queued broadcasts', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				object: 'list',
				data: [
					{
						id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
						audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
						status: 'queued',
						created_at: '2024-11-01T15:13:31.723Z',
						scheduled_at: '2024-11-02T10:00:00.000Z',
						sent_at: null,
					},
				],
			},
			error: null,
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.data[0]?.status).toBe('queued');
		expect(result.data?.data[0]?.scheduled_at).toBe('2024-11-02T10:00:00.000Z');
		expect(result.data?.data[0]?.sent_at).toBeNull();
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle sent broadcasts', async () => {
		mockList.mockResolvedValueOnce({
			data: {
				object: 'list',
				data: [
					{
						id: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
						audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
						status: 'sent',
						created_at: '2024-12-01T19:32:22.980Z',
						scheduled_at: '2024-12-02T19:32:22.980Z',
						sent_at: '2024-12-02T19:32:22.980Z',
					},
				],
			},
			error: null,
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(true);
		expect(result.data?.data[0]?.status).toBe('sent');
		expect(result.data?.data[0]?.scheduled_at).toBe('2024-12-02T19:32:22.980Z');
		expect(result.data?.data[0]?.sent_at).toBe('2024-12-02T19:32:22.980Z');
		expect(mockList).toHaveBeenCalledWith();
	});

	it('should handle errors gracefully', async () => {
		mockList.mockResolvedValueOnce({
			error: { message: 'API key invalid' },
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle no data returned from API', async () => {
		mockList.mockResolvedValueOnce({
			data: null,
			error: null,
		});

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockList.mockRejectedValueOnce(new Error('Network error'));

		const result = await listBroadcasts({}, 'test-api-key');

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
