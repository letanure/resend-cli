import { describe, expect, it } from 'vitest';
import { UpdateEmailOptionsSchema } from '../schema.js';

describe('UpdateEmailOptionsSchema', () => {
	const validEmailId = '402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f';
	const futureDate = new Date(Date.now() + 60000).toISOString(); // 1 minute from now

	it('validates correct email update data', () => {
		const validData = {
			id: validEmailId,
			scheduledAt: futureDate,
		};

		const result = UpdateEmailOptionsSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('rejects invalid email ID format', () => {
		const invalidData = {
			id: 'invalid-id',
			scheduledAt: futureDate,
		};

		const result = UpdateEmailOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects email ID with wrong length', () => {
		const invalidData = {
			id: '402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f-extra',
			scheduledAt: futureDate,
		};

		const result = UpdateEmailOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects past dates', () => {
		const pastDate = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
		const invalidData = {
			id: validEmailId,
			scheduledAt: pastDate,
		};

		const result = UpdateEmailOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('rejects invalid date format', () => {
		const invalidData = {
			id: validEmailId,
			scheduledAt: 'invalid-date',
		};

		const result = UpdateEmailOptionsSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('requires both id and scheduledAt fields', () => {
		const incompleteData = {
			id: validEmailId,
		};

		const result = UpdateEmailOptionsSchema.safeParse(incompleteData);
		expect(result.success).toBe(false);
	});
});
