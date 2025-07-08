import { describe, expect, it } from 'vitest';
import { updateDomainSchema } from '../schema.js';

describe('updateDomainSchema', () => {
	it('should validate a valid domain update with all parameters', () => {
		const result = updateDomainSchema.safeParse({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			clickTracking: true,
			openTracking: false,
			tls: 'enforced',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('b8617ad3-b712-41d9-81a0-f7c3d879314e');
			expect(result.data.clickTracking).toBe(true);
			expect(result.data.openTracking).toBe(false);
			expect(result.data.tls).toBe('enforced');
		}
	});

	it('should validate with only domain ID', () => {
		const result = updateDomainSchema.safeParse({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('b8617ad3-b712-41d9-81a0-f7c3d879314e');
			expect(result.data.clickTracking).toBeUndefined();
			expect(result.data.openTracking).toBeUndefined();
			expect(result.data.tls).toBeUndefined();
		}
	});

	it('should validate with opportunistic TLS', () => {
		const result = updateDomainSchema.safeParse({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			tls: 'opportunistic',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.tls).toBe('opportunistic');
		}
	});

	it('should reject empty domain ID', () => {
		const result = updateDomainSchema.safeParse({
			domainId: '',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Domain ID is required');
		}
	});

	it('should reject missing domain ID', () => {
		const result = updateDomainSchema.safeParse({
			clickTracking: true,
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Required');
		}
	});

	it('should reject invalid TLS value', () => {
		const result = updateDomainSchema.safeParse({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			tls: 'invalid',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('TLS must be either "opportunistic" or "enforced"');
		}
	});

	it('should trim whitespace from domain ID', () => {
		const result = updateDomainSchema.safeParse({
			domainId: '  b8617ad3-b712-41d9-81a0-f7c3d879314e  ',
			clickTracking: true,
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('b8617ad3-b712-41d9-81a0-f7c3d879314e');
		}
	});

	it('should remove empty fields', () => {
		const result = updateDomainSchema.safeParse({
			domainId: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			clickTracking: true,
			openTracking: undefined,
			tls: '',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('b8617ad3-b712-41d9-81a0-f7c3d879314e');
			expect(result.data.clickTracking).toBe(true);
			expect(result.data.openTracking).toBeUndefined();
			expect(result.data.tls).toBeUndefined();
		}
	});
});
