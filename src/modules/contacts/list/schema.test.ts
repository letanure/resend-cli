import { describe, expect, it } from 'vitest';
import { ListContactsOptionsSchema } from './schema.js';

describe('Contact List Schema', () => {
	it('should validate contact list data with valid audience_id', () => {
		const validData = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		const result = ListContactsOptionsSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it('should reject data without audience_id', () => {
		const invalidData = {};

		expect(() => ListContactsOptionsSchema.parse(invalidData)).toThrow('Required');
	});

	it('should reject empty string for audience_id', () => {
		const invalidData = {
			audience_id: '',
		};

		expect(() => ListContactsOptionsSchema.parse(invalidData)).toThrow('Audience ID is required');
	});

	it('should reject invalid UUID format for audience_id', () => {
		const invalidData = {
			audience_id: 'invalid-uuid',
		};

		expect(() => ListContactsOptionsSchema.parse(invalidData)).toThrow('Audience ID must be a valid UUID');
	});

	it('should reject null value for audience_id', () => {
		const invalidData = {
			audience_id: null,
		};

		expect(() => ListContactsOptionsSchema.parse(invalidData)).toThrow();
	});

	it('should reject undefined value for audience_id', () => {
		const invalidData = {
			audience_id: undefined,
		};

		expect(() => ListContactsOptionsSchema.parse(invalidData)).toThrow();
	});

	it('should accept valid UUID formats', () => {
		const validUUIDs = [
			'78261eea-8f8b-4381-83c6-79fa7120f1cf',
			'12345678-1234-1234-1234-123456789012',
			'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		];

		for (const uuid of validUUIDs) {
			const validData = {
				audience_id: uuid,
			};

			const result = ListContactsOptionsSchema.parse(validData);
			expect(result.audience_id).toBe(uuid);
		}
	});

	it('should reject non-string values for audience_id', () => {
		const invalidData = {
			audience_id: 123,
		};

		expect(() => ListContactsOptionsSchema.parse(invalidData)).toThrow();
	});

	it('should ignore extra properties', () => {
		const dataWithExtraProps = {
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			extraProp: 'should be ignored',
		};

		const result = ListContactsOptionsSchema.parse(dataWithExtraProps);
		expect(result).toEqual({
			audience_id: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		});
		expect(result).not.toHaveProperty('extraProp');
	});
});
