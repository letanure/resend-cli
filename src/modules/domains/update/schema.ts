import { z } from 'zod';
import { removeEmptyFields } from '@/utils/zodTransforms.js';

// TLS configuration enum - matches Resend's UpdateDomainsOptions['tls']
const tlsSchema = z
	.union([z.enum(['opportunistic', 'enforced'] as const), z.literal('').transform(() => undefined), z.undefined()])
	.optional();

export const updateDomainSchema = z
	.object({
		domainId: z.string().trim().min(1, { message: 'Domain ID is required' }),
		clickTracking: z.boolean().optional(),
		openTracking: z.boolean().optional(),
		tls: tlsSchema,
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
