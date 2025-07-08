import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateContact } from '../action.js';

// Mock the Resend module
const mockUpdate = vi.fn();
vi.mock('resend', () => ({
	Resend: vi.fn().mockImplementation(() => ({
		contacts: {
			update: mockUpdate,
		},
	})),
}));

describe('updateContact', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should update contact successfully by ID', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				object: 'contact',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			error: null,
		});

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
				firstName: 'John',
				lastName: 'Doe',
				unsubscribed: false,
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('contact');
		expect(result.data?.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
		expect(result.error).toBeUndefined();
		expect(mockUpdate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			firstName: 'John',
			lastName: 'Doe',
			unsubscribed: false,
		});
	});

	it('should update contact successfully by email', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				object: 'contact',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			error: null,
		});

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				email: 'john@example.com',
				firstName: 'John',
				unsubscribed: true,
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('contact');
		expect(result.data?.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
		expect(result.error).toBeUndefined();
		expect(mockUpdate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'john@example.com',
			firstName: 'John',
			unsubscribed: true,
		});
	});

	it('should update contact with only required fields', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				object: 'contact',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			error: null,
		});

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('contact');
		expect(result.data?.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
		expect(result.error).toBeUndefined();
		expect(mockUpdate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
		});
	});

	it('should update contact with both ID and email', async () => {
		mockUpdate.mockResolvedValueOnce({
			data: {
				object: 'contact',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			error: null,
		});

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
				email: 'john@example.com',
				lastName: 'Smith',
			},
			'test-api-key',
		);

		expect(result.success).toBe(true);
		expect(result.data?.object).toBe('contact');
		expect(result.data?.id).toBe('e169aa45-1ecf-4183-9955-b1499d5701d3');
		expect(result.error).toBeUndefined();
		expect(mockUpdate).toHaveBeenCalledWith({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			email: 'john@example.com',
			lastName: 'Smith',
		});
	});

	it('should handle errors gracefully', async () => {
		mockUpdate.mockResolvedValueOnce({
			error: { message: 'Contact not found' },
		});

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: 'invalid-id',
				firstName: 'John',
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

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});

	it('should handle exceptions', async () => {
		mockUpdate.mockRejectedValueOnce(new Error('Network error'));

		const result = await updateContact(
			{
				audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				id: 'e169aa45-1ecf-4183-9955-b1499d5701d3',
			},
			'test-api-key',
		);

		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect(result.data).toBeUndefined();
	});
});
