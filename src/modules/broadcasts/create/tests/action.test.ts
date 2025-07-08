import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createBroadcast } from '../action.js';

// Mock the Resend module
const mockCreate = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		broadcasts: {
			create: mockCreate,
		},
	})),
}));

describe('createBroadcast', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should create broadcast successfully with all parameters', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await createBroadcast(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Acme <onboarding@resend.dev>',
				subject: 'hello world',
				replyTo: 'reply@example.com',
				html: '<p>Hello world</p>',
				text: 'Hello world',
				name: 'Test Broadcast',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.id).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		expect(result.error).toBeUndefined();
		expect(mockCreate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'Acme <onboarding@resend.dev>',
			subject: 'hello world',
			replyTo: 'reply@example.com',
			html: '<p>Hello world</p>',
			text: 'Hello world',
			name: 'Test Broadcast',
		});
	});

	it('should create broadcast with only required parameters', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await createBroadcast(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Acme <onboarding@resend.dev>',
				subject: 'hello world',
				html: '<p>Hello world</p>',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockCreate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'Acme <onboarding@resend.dev>',
			subject: 'hello world',
			html: '<p>Hello world</p>',
		});
	});

	it('should handle multiple reply-to addresses', async () => {
		mockCreate.mockResolvedValueOnce({
			data: {
				id: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			},
			error: null,
		});

		const result = await createBroadcast(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'Acme <onboarding@resend.dev>',
				subject: 'hello world',
				replyTo: 'reply1@example.com, reply2@example.com',
				text: 'Hello world',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(mockCreate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'Acme <onboarding@resend.dev>',
			subject: 'hello world',
			replyTo: 'reply1@example.com, reply2@example.com',
			text: 'Hello world',
		});
	});

	it('should handle errors gracefully', async () => {
		mockCreate.mockResolvedValueOnce({
			error: { message: 'Audience not found' },
		});

		const result = await createBroadcast(
			{
				audienceId: 'invalid-id',
				from: 'test@example.com',
				subject: 'test',
				html: '<p>test</p>',
			},
			'test-api-key',
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

		const result = await createBroadcast(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'test@example.com',
				subject: 'test',
				html: '<p>test</p>',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockCreate.mockRejectedValueOnce(new Error('Network error'));

		const result = await createBroadcast(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				from: 'test@example.com',
				subject: 'test',
				html: '<p>test</p>',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
