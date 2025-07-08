import { describe, expect, it } from 'vitest';
import { CreateEmailOptionsSchema } from '../schema.js';

describe('Email Schema Validation', () => {
	it('validates required fields', () => {
		const result = CreateEmailOptionsSchema.safeParse({});

		expect(result.success).toBe(false);
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			expect(errors.from).toBeDefined();
			expect(errors.to).toBeDefined();
			expect(errors.subject).toBeDefined();
		}
	});

	it('accepts valid email data', () => {
		const validData = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
			text: 'Hello',
		};

		const result = CreateEmailOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('requires either html or text content', () => {
		const noContent = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
		};

		const result = CreateEmailOptionsSchema.safeParse(noContent);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.message).toContain('html or text');
		}
	});

	it('accepts valid email data with text', () => {
		const withText = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
			text: 'Hello',
		};

		const result = CreateEmailOptionsSchema.safeParse(withText);
		expect(result.success).toBe(true);
	});

	it('accepts valid email data with HTML', () => {
		const withHtml = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
			html: '<p>Hello</p>',
		};

		const result = CreateEmailOptionsSchema.safeParse(withHtml);
		expect(result.success).toBe(true);
	});

	it('accepts comma-separated recipients', () => {
		const multipleRecipients = {
			from: 'test@example.com',
			to: 'user1@example.com,user2@example.com',
			subject: 'Test',
			text: 'Hello',
		};

		const result = CreateEmailOptionsSchema.safeParse(multipleRecipients);
		expect(result.success).toBe(true);
	});

	it('handles optional fields', () => {
		const withOptionalFields = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
			html: '<p>Hello</p>',
			bcc: 'hidden@example.com',
			cc: 'cc@example.com',
			replyTo: 'reply@example.com',
		};

		const result = CreateEmailOptionsSchema.safeParse(withOptionalFields);
		expect(result.success).toBe(true);
	});

	it('accepts valid ISO date for scheduling', () => {
		const withScheduledDate = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
			text: 'Hello',
			scheduledAt: '2025-12-25T10:00:00Z',
		};

		const result = CreateEmailOptionsSchema.safeParse(withScheduledDate);
		expect(result.success).toBe(true);
	});

	it('accepts natural language scheduling', () => {
		const withNaturalDate = {
			from: 'test@example.com',
			to: 'user@example.com',
			subject: 'Test',
			text: 'Hello',
			scheduledAt: 'in 1 hour',
		};

		const result = CreateEmailOptionsSchema.safeParse(withNaturalDate);
		expect(result.success).toBe(true);
	});
});
