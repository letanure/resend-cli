import { z } from 'zod';

export const RetrieveAudienceOptionsSchema = z.object({
	id: z
		.string()
		.trim()
		.min(1, { message: 'Audience ID is required' })
		.uuid({ message: 'Audience ID must be a valid UUID' }),
});

export type RetrieveAudienceOptionsType = z.infer<typeof RetrieveAudienceOptionsSchema>;
