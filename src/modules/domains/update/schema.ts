import { z } from 'zod';
import { removeEmptyFields } from '@/utils/zodTransforms.js';

// TLS configuration enum based on API documentation
const tlsSchema = z
	.string()
	.optional()
	.refine((val) => val === undefined || val === '' || val === 'opportunistic' || val === 'enforced', {
		message: 'TLS must be either "opportunistic" or "enforced"',
	})
	.transform((val) => (val === '' || val === undefined ? undefined : val));

export const updateDomainSchema = z
	.object({
		domainId: z.string().trim().min(1, { message: 'Domain ID is required' }),
		clickTracking: z
			.union([z.boolean(), z.string()])
			.transform((val) => (typeof val === 'string' ? val === 'true' : val))
			.optional(),
		openTracking: z
			.union([z.boolean(), z.string()])
			.transform((val) => (typeof val === 'string' ? val === 'true' : val))
			.optional(),
		tls: tlsSchema.optional(),
	})
	.transform((data) => {
		const cleaned = removeEmptyFields(data);
		// Ensure domainId is always present since it's required
		return {
			domainId: data.domainId,
			...cleaned,
		};
	});

export type UpdateDomainData = z.infer<typeof updateDomainSchema>;
