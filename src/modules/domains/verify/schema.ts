import { z } from 'zod';

export const verifyDomainSchema = z.object({
	domainId: z.string().trim().min(1, { message: 'Domain ID is required' }),
});

export type VerifyDomainData = z.infer<typeof verifyDomainSchema>;
