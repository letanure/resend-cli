import { z } from 'zod';

export const CreateAudienceOptionsSchema = z.object({
	name: z.string().min(1, 'Audience name is required').max(100, 'Audience name must be 100 characters or less').trim(),
});

export type CreateAudienceOptionsType = z.infer<typeof CreateAudienceOptionsSchema>;
