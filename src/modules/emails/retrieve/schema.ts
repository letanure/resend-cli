import { z } from 'zod';

// Schema for email retrieval input
export const GetEmailOptionsSchema = z.object({
	id: z
		.string()
		.length(36, 'Email ID must be exactly 36 characters')
		.regex(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
			'Email ID must be a valid UUID format (e.g., 402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f)',
		),
});

export type GetEmailOptionsType = z.infer<typeof GetEmailOptionsSchema>;
