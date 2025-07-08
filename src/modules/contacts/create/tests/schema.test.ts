import { describe, expect, it } from 'vitest';
import { CreateContactOptionsSchema } from '../schema.js';

describe('Contact Create Schema', () => {
	it('should validate valid contact data', () => {
		const validData = {
			email: 'test@example.com',
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			firstName: 'John',
			lastName: 'Doe',
			unsubscribed: false,
		};

		const result = CreateContactOptionsSchema.parse(validData);
		expect(result).toEqual(validData);
	});

	it('should validate minimal required data', () => {
		const minimalData = {
			email: 'test@example.com',
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		const result = CreateContactOptionsSchema.parse(minimalData);
		expect(result.email).toBe('test@example.com');
		expect(result.audienceId).toBe('78261eea-8f8b-4381-83c6-79fa7120f1cf');
		expect(result.unsubscribed).toBe(false); // default value
	});

	it('should reject invalid email', () => {
		const invalidData = {
			email: 'invalid-email',
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
		};

		expect(() => CreateContactOptionsSchema.parse(invalidData)).toThrow('Invalid email address');
	});

	it('should reject missing audienceId', () => {
		const invalidData = {
			email: 'test@example.com',
		};

		expect(() => CreateContactOptionsSchema.parse(invalidData)).toThrow();
	});

	it('should transform boolean strings correctly', () => {
		const dataWithStringBoolean = {
			email: 'test@example.com',
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			unsubscribed: 'true',
		};

		const result = CreateContactOptionsSchema.parse(dataWithStringBoolean);
		expect(result.unsubscribed).toBe(true);
	});

	it('should handle optional fields', () => {
		const dataWithOptionals = {
			email: 'test@example.com',
			audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			firstName: '',
			lastName: undefined,
		};

		const result = CreateContactOptionsSchema.parse(dataWithOptionals);
		expect(result.firstName).toBe('');
		expect(result.lastName).toBeUndefined();
	});
});
