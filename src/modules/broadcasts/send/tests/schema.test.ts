import { describe, expect, it } from 'vitest';
import { sendBroadcastSchema } from '../schema.js';

describe('sendBroadcastSchema', () => {
	it('should validate required broadcast ID', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		}
	});

	it('should validate with optional scheduledAt', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			scheduledAt: 'in 1 min',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.scheduledAt).toBe('in 1 min');
		}
	});

	it('should validate with ISO 8601 scheduledAt format', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			scheduledAt: '2024-08-05T11:52:01.858Z',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.scheduledAt).toBe('2024-08-05T11:52:01.858Z');
		}
	});

	it('should fail validation without broadcast ID', () => {
		const result = sendBroadcastSchema.safeParse({});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should fail validation with empty broadcast ID', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should fail validation with whitespace-only broadcast ID', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '   ',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('required');
		}
	});

	it('should trim whitespace from broadcast ID', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '  49a3999c-0ce1-4ea6-ab68-afcd6dc2e794  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		}
	});

	it('should preserve empty scheduledAt field (cleaning handled in actions)', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			scheduledAt: '',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.scheduledAt).toBe('');
		}
	});

	it('should handle null values', () => {
		const result = sendBroadcastSchema.safeParse({
			broadcastId: null,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Expected string, received null');
		}
	});
});
