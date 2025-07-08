import { describe, expect, it } from 'vitest';
import { createDomainSchema } from './schema.js';

describe('createDomainSchema', () => {
	it('should validate required name field', () => {
		const result = createDomainSchema.safeParse({});
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Required');
		}
	});

	it('should validate empty name field', () => {
		const result = createDomainSchema.safeParse({ name: '' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Domain name is required');
		}
	});

	it('should validate whitespace-only name field', () => {
		const result = createDomainSchema.safeParse({ name: '   ' });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Domain name is required');
		}
	});

	it('should accept valid domain name', () => {
		const result = createDomainSchema.safeParse({ name: 'example.com' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe('example.com');
		}
	});

	it('should trim domain name', () => {
		const result = createDomainSchema.safeParse({ name: '  example.com  ' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe('example.com');
		}
	});

	it('should validate region enum values', () => {
		const invalidResult = createDomainSchema.safeParse({
			name: 'example.com',
			region: 'invalid-region',
		});
		expect(invalidResult.success).toBe(false);

		const validResult = createDomainSchema.safeParse({
			name: 'example.com',
			region: 'eu-west-1',
		});
		expect(validResult.success).toBe(true);
		if (validResult.success) {
			expect(validResult.data.region).toBe('eu-west-1');
		}
	});

	it('should accept undefined for optional fields', () => {
		const result = createDomainSchema.safeParse({ name: 'example.com' });
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.region).toBeUndefined();
			expect(result.data.custom_return_path).toBeUndefined();
		}
	});

	it('should accept all valid regions', () => {
		const regions = ['us-east-1', 'eu-west-1', 'sa-east-1', 'ap-northeast-1'];

		for (const region of regions) {
			const result = createDomainSchema.safeParse({
				name: 'example.com',
				region,
			});
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.region).toBe(region);
			}
		}
	});

	it('should trim custom_return_path', () => {
		const result = createDomainSchema.safeParse({
			name: 'example.com',
			custom_return_path: '  mail  ',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.custom_return_path).toBe('mail');
		}
	});
});
