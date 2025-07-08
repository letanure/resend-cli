import { describe, expect, it } from 'vitest';
import { verifyDomainSchema } from '../schema.js';

describe('verifyDomainSchema', () => {
	it('should validate a valid domain ID', () => {
		const result = verifyDomainSchema.safeParse({
			domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		}
	});

	it('should reject empty domain ID', () => {
		const result = verifyDomainSchema.safeParse({
			domainId: '',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Domain ID is required');
		}
	});

	it('should reject missing domain ID', () => {
		const result = verifyDomainSchema.safeParse({});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Required');
		}
	});

	it('should trim whitespace from domain ID', () => {
		const result = verifyDomainSchema.safeParse({
			domainId: '  d91cd9bd-1176-453e-8fc1-35364d380206  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		}
	});
});
