import { z } from 'zod';

export const DeleteAudienceOptionsSchema = z.object({
	id: z
		.string()
		.trim()
		.min(1, { message: 'Audience ID is required' })
		.uuid({ message: 'Audience ID must be a valid UUID' }),
});

export type DeleteAudienceOptionsType = z.infer<typeof DeleteAudienceOptionsSchema>;
