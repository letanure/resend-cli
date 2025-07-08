import { describe, expect, it } from 'vitest';
import { retrieveBroadcastSchema } from '../schema.js';

describe('retrieveBroadcastSchema', () => {
	it('should validate a valid broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		}
	});

	it('should validate another valid broadcast ID format', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: 'abc123-def456-ghi789',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('abc123-def456-ghi789');
		}
	});

	it('should reject missing broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues).toHaveLength(1);
			expect(result.error.issues[0]?.path).toEqual(['broadcastId']);
			expect(result.error.issues[0]?.message).toBe('Broadcast ID is required');
		}
	});

	it('should reject empty broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: '',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Broadcast ID is required');
		}
	});

	it('should reject broadcast ID with only whitespace', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: '   ',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Broadcast ID is required');
		}
	});

	it('should trim whitespace from broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: '  559ac32e-9ef5-46fb-82a1-b76b840c0f7b  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		}
	});

	it('should reject null broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: null,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Expected string, received null');
		}
	});

	it('should reject undefined broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: undefined,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Broadcast ID is required');
		}
	});

	it('should reject non-string broadcast ID', () => {
		const result = retrieveBroadcastSchema.safeParse({
			broadcastId: 123,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Expected string, received number');
		}
	});
});
