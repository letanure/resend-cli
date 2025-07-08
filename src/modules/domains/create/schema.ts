import { z } from 'zod';

export const createDomainSchema = z.object({
	name: z.string().trim().min(1, { message: 'Domain name is required' }),
	region: z.enum(['us-east-1', 'eu-west-1', 'sa-east-1', 'ap-northeast-1']).optional(),
	custom_return_path: z.string().trim().optional(),
});

export type CreateDomainData = z.infer<typeof createDomainSchema>;
