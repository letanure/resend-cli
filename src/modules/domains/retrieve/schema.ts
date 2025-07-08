import { z } from 'zod';

export const retrieveDomainSchema = z.object({
	domainId: z.string().trim().min(1, { message: 'Domain ID is required' }),
});

export type RetrieveDomainData = z.infer<typeof retrieveDomainSchema>;
