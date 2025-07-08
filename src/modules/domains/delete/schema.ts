import { z } from 'zod';

export const deleteDomainSchema = z.object({
	domainId: z.string().trim().min(1, { message: 'Domain ID is required' }),
});

export type DeleteDomainData = z.infer<typeof deleteDomainSchema>;
