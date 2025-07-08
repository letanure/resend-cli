import { describe, expect, it } from 'vitest';
import { DeleteContactOptionsSchema } from '../schema.js';

describe('DeleteContactOptionsSchema', () => {
	it('validates correct data with ID', () => {
		const validData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		const result = DeleteContactOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('validates correct data with email', () => {
		const validData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'contact@example.com',
		};

		const result = DeleteContactOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('validates correct data with both ID and email', () => {
		const validData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '479e3145-dd38-476b-932c-529ceb705947',
			email: 'contact@example.com',
		};

		const result = DeleteContactOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('rejects data without audience_id', () => {
		const invalidData = {
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects data without both ID and email', () => {
		const invalidData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects empty audience_id', () => {
		const invalidData = {
			audience_id: '',
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects empty ID when provided', () => {
		const invalidData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects empty email when provided', () => {
		const invalidData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: '',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('trims whitespace from fields', () => {
		const dataWithWhitespace = {
			audience_id: '  78261eea-8f8b-4381-83c6-79fa7120f1cf  ',
			id: '  479e3145-dd38-476b-932c-529ceb705947  ',
			email: '  contact@example.com  ',
		};

		const result = DeleteContactOptionsSchema.safeParse(dataWithWhitespace);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.audience_id).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
			expect(result.data.id).toBe('479e3145-dd38-476b-932c-529ceb705947');
			expect(result.data.email).toBe('contact@example.com');
		}
	});

	it('rejects non-UUID audience_id', () => {
		const invalidData = {
			audience_id: 'not-a-uuid',
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects non-UUID contact id', () => {
		const invalidData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: 'not-a-uuid',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects invalid email format', () => {
		const invalidData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'not-an-email',
		};

		const result = DeleteContactOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('accepts valid UUID formats', () => {
		const validUUIDs = [
			'78261eea-8f8b-4381-83c6-79fa7120f1cf',
			'12345678-1234-1234-1234-123456789abc',
			'87654321-4321-4321-4321-cba987654321',
		];

		for (const audienceId of validUUIDs) {
			for (const contactId of validUUIDs) {
				const validData = { audience_id: audienceId, id: contactId };
				const result = DeleteContactOptionsSchema.safeParse(validData);
				expect(result.success).toBe(true);
			}
		}
	});

	it('accepts valid email formats', () => {
		const validEmails = ['user@example.com', 'test.email@domain.co.uk', 'user+tag@example.org', '123@test.com'];

		for (const email of validEmails) {
			const validData = {
				audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
				email,
			};
			const result = DeleteContactOptionsSchema.safeParse(validData);
			expect(result.success).toBe(true);
		}
	});
});
