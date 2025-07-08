import { describe, expect, it } from 'vitest';
import { deleteBroadcastSchema } from '../schema.js';

describe('deleteBroadcastSchema', () => {
	it('should validate required broadcast ID', () => {
		const result = deleteBroadcastSchema.safeParse({
			broadcastId: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		}
	});

	it('should fail validation without broadcast ID', () => {
		const result = deleteBroadcastSchema.safeParse({});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should fail validation with empty broadcast ID', () => {
		const result = deleteBroadcastSchema.safeParse({
			broadcastId: '',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should fail validation with whitespace-only broadcast ID', () => {
		const result = deleteBroadcastSchema.safeParse({
			broadcastId: '   ',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should trim whitespace from broadcast ID', () => {
		const result = deleteBroadcastSchema.safeParse({
			broadcastId: '  559ac32e-9ef5-46fb-82a1-b76b840c0f7b  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		}
	});

	it('should handle null values', () => {
		const result = deleteBroadcastSchema.safeParse({
			broadcastId: null,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Expected string, received null');
		}
	});

	it('should handle undefined values', () => {
		const result = deleteBroadcastSchema.safeParse({
			broadcastId: undefined,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});
});
