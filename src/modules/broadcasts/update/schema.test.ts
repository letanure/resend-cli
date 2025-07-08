import { describe, expect, it } from 'vitest';
import { updateBroadcastSchema } from './schema.js';

describe('updateBroadcastSchema', () => {
	it('should validate a valid broadcast update with all parameters', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'Acme <onboarding@resend.dev>',
			subject: 'Updated subject',
			replyTo: 'reply@example.com',
			html: '<p>Updated HTML content</p>',
			text: 'Updated text content',
			name: 'Updated Broadcast Name',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.from).toBe('Acme <onboarding@resend.dev>');
			expect(result.data.subject).toBe('Updated subject');
			expect(result.data.replyTo).toBe('reply@example.com');
			expect(result.data.html).toBe('<p>Updated HTML content</p>');
			expect(result.data.text).toBe('Updated text content');
			expect(result.data.name).toBe('Updated Broadcast Name');
		}
	});

	it('should validate with only required parameter', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.audienceId).toBeUndefined();
			expect(result.data.from).toBeUndefined();
			expect(result.data.subject).toBeUndefined();
		}
	});

	it('should validate with only some parameters', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			subject: 'New subject',
			html: '<p>New HTML content</p>',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.subject).toBe('New subject');
			expect(result.data.html).toBe('<p>New HTML content</p>');
			expect(result.data.audienceId).toBeUndefined();
			expect(result.data.from).toBeUndefined();
		}
	});

	it('should reject missing broadcast ID', () => {
		const result = updateBroadcastSchema.safeParse({
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues).toHaveLength(1);
			expect(result.error.issues[0]?.path).toEqual(['broadcastId']);
			expect(result.error.issues[0]?.message).toBe('Broadcast ID is required');
		}
	});

	it('should reject empty broadcast ID', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '',
			subject: 'test subject',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Broadcast ID is required');
		}
	});

	it('should validate friendly email format', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			from: 'John Doe <john@example.com>',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.from).toBe('John Doe <john@example.com>');
		}
	});

	it('should validate multiple reply-to addresses', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			replyTo: 'reply1@example.com, reply2@example.com',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.replyTo).toBe('reply1@example.com, reply2@example.com');
		}
	});

	it('should trim whitespace from broadcast ID', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '  49a3999c-0ce1-4ea6-ab68-afcd6dc2e794  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
		}
	});

	it('should remove empty fields', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			subject: 'test subject',
			audienceId: undefined,
			from: undefined,
			replyTo: undefined,
			html: undefined,
			text: undefined,
			name: undefined,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.broadcastId).toBe('49a3999c-0ce1-4ea6-ab68-afcd6dc2e794');
			expect(result.data.subject).toBe('test subject');
			expect(result.data.audienceId).toBeUndefined();
			expect(result.data.from).toBeUndefined();
			expect(result.data.replyTo).toBeUndefined();
			expect(result.data.html).toBeUndefined();
			expect(result.data.text).toBeUndefined();
			expect(result.data.name).toBeUndefined();
		}
	});

	it('should reject invalid email format', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			from: 'invalid-email',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('email');
		}
	});

	it('should reject invalid reply-to email format', () => {
		const result = updateBroadcastSchema.safeParse({
			broadcastId: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			replyTo: 'invalid-email',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('email');
		}
	});
});
