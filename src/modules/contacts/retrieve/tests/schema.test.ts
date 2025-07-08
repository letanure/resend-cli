import { describe, expect, it } from 'vitest';
import { RetrieveContactOptionsSchema } from '../schema.js';

describe('Contact Retrieve Schema', () => {
	it('should validate contact data with ID', () => {
		const validData = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		const result = RetrieveContactOptionsSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it('should validate contact data with email', () => {
		const validData = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'test@example.com',
		};

		const result = RetrieveContactOptionsSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it('should validate contact data with both ID and email', () => {
		const validData = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '479e3145-dd38-476b-932c-529ceb705947',
			email: 'test@example.com',
		};

		const result = RetrieveContactOptionsSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it('should reject data without audienceId', () => {
		const invalidData = {
			id: '479e3145-dd38-476b-932c-529ceb705947',
		};

		expect(() => RetrieveContactOptionsSchema.parse(invalidData)).toThrow();
	});

	it('should reject data without ID or email', () => {
		const invalidData = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		expect(() => RetrieveContactOptionsSchema.parse(invalidData)).toThrow('Either id or email must be provided');
	});

	it('should reject invalid email format', () => {
		const invalidData = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			email: 'invalid-email',
		};

		expect(() => RetrieveContactOptionsSchema.parse(invalidData)).toThrow('Invalid email address');
	});

	it('should reject empty string values for required fields', () => {
		const dataWithEmptyStrings = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '',
			email: 'test@example.com',
		};

		// Empty strings should be rejected for non-optional fields
		expect(() => RetrieveContactOptionsSchema.parse(dataWithEmptyStrings)).toThrow('Required');
	});

	it('should handle undefined values correctly', () => {
		const dataWithUndefined = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: undefined,
			email: 'test@example.com',
		};

		const result = RetrieveContactOptionsSchema.parse(dataWithUndefined);
		expect(result.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
		expect(result.id).toBeUndefined();
		expect(result.email).toBe('test@example.com');
	});

	it('should require at least one identifier even with empty strings', () => {
		const invalidData = {
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			id: '',
			email: '',
		};

		expect(() => RetrieveContactOptionsSchema.parse(invalidData)).toThrow('Either id or email must be provided');
	});
});
