import { describe, expect, it } from 'vitest';
import { retrieveDomainSchema } from '../schema.js';

describe('retrieveDomainSchema', () => {
	it('should validate correct domain ID', () => {
		const result = retrieveDomainSchema.safeParse({
			domainId: 'd91cd9bd-1176-453e-8fc1-35364d380206',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		}
	});

	it('should trim whitespace from domain ID', () => {
		const result = retrieveDomainSchema.safeParse({
			domainId: '  d91cd9bd-1176-453e-8fc1-35364d380206  ',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.domainId).toBe('d91cd9bd-1176-453e-8fc1-35364d380206');
		}
	});

	it('should reject empty domain ID', () => {
		const result = retrieveDomainSchema.safeParse({
			domainId: '',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Domain ID is required');
		}
	});

	it('should reject missing domain ID', () => {
		const result = retrieveDomainSchema.safeParse({});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Required');
		}
	});

	it('should reject whitespace-only domain ID', () => {
		const result = retrieveDomainSchema.safeParse({
			domainId: '   ',
		});

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain('Domain ID is required');
		}
	});
});
