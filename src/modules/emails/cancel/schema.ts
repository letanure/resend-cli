import { z } from 'zod';

export const CancelEmailOptionsSchema = z.object({
	id: z
		.string()
		.length(36, 'Email ID must be exactly 36 characters')
		.regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Email ID must be a valid UUID format'),
});

export type CancelEmailOptionsType = z.infer<typeof CancelEmailOptionsSchema>;
