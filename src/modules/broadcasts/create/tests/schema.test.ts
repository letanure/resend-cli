import { describe, expect, it } from 'vitest';
import { createBroadcastSchema } from '../schema.js';

describe('createBroadcastSchema', () => {
	it('should validate a valid broadcast with all parameters', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'Acme <onboarding@resend.dev>',
			subject: 'hello world',
			replyTo: 'reply@example.com',
			html: '<p>Hello world</p>',
			text: 'Hello world',
			name: 'Test Broadcast',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.from).toBe('Acme <onboarding@resend.dev>');
			expect(result.data.subject).toBe('hello world');
			expect(result.data.replyTo).toBe('reply@example.com');
			expect(result.data.html).toBe('<p>Hello world</p>');
			expect(result.data.text).toBe('Hello world');
			expect(result.data.name).toBe('Test Broadcast');
		}
	});

	it('should validate with only required parameters and HTML', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'test@example.com',
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.html).toBe('<p>Hello world</p>');
		}
	});

	it('should validate with only required parameters and text', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'test@example.com',
			subject: 'test subject',
			text: 'Hello world',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.text).toBe('Hello world');
		}
	});

	it('should reject missing audience ID', () => {
		const result = createBroadcastSchema.safeParse({
			from: 'test@example.com',
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues).toHaveLength(1);
			expect(result.error.issues[0]?.path).toEqual(['audienceId']);
			expect(result.error.issues[0]?.message).toBe('Audience ID is required');
		}
	});

	it('should reject empty audience ID', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '',
			from: 'test@example.com',
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Audience ID is required');
		}
	});

	it('should reject missing from field', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Required');
		}
	});

	it('should reject missing subject', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'test@example.com',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Required');
		}
	});

	it('should reject missing both html and text', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'test@example.com',
			subject: 'test subject',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Either html or text must be provided');
		}
	});

	it('should validate friendly email format', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'John Doe <john@example.com>',
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.from).toBe('John Doe <john@example.com>');
		}
	});

	it('should validate multiple reply-to addresses', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'test@example.com',
			subject: 'test subject',
			replyTo: 'reply1@example.com, reply2@example.com',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.replyTo).toBe('reply1@example.com, reply2@example.com');
		}
	});

	it('should trim whitespace from audience ID', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '  78261eea-8f8b-4381-83c6-79fa7120f1cf  ',
			from: 'test@example.com',
			subject: 'test subject',
			html: '<p>Hello world</p>',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
		}
	});

	it('should remove empty fields', () => {
		const result = createBroadcastSchema.safeParse({
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			from: 'test@example.com',
			subject: 'test subject',
			replyTo: undefined,
			html: '<p>Hello world</p>',
			text: undefined,
			name: undefined,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.html).toBe('<p>Hello world</p>');
			expect(result.data.replyTo).toBeUndefined();
			expect(result.data.text).toBeUndefined();
			expect(result.data.name).toBeUndefined();
		}
	});
});
