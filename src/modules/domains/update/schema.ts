import { z } from 'zod';

// TLS configuration enum - matches Resend's UpdateDomainsOptions['tls']
const tlsSchema = z
	.union([z.enum(['opportunistic', 'enforced'] as const), z.literal('').transform(() => undefined), z.undefined()])
	.optional();

export const updateDomainSchema = z.object({
	domainId: z.string().trim().min(1, { message: 'Domain ID is required' }),
	clickTracking: z.boolean().optional(),
	openTracking: z.boolean().optional(),
	tls: tlsSchema,
});

export type UpdateDomainData = z.infer<typeof updateDomainSchema>;
