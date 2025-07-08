import { z } from 'zod';

export const DeleteContactOptionsSchema = z
	.object({
		audienceId: z
			.string()
			.trim()
			.min(1, { message: 'Audience ID is required' })
			.uuid({ message: 'Audience ID must be a valid UUID' }),
		id: z
			.string()
			.trim()
			.min(1, { message: 'Contact ID must not be empty' })
			.uuid({ message: 'Contact ID must be a valid UUID' })
			.optional(),
		email: z
			.string()
			.trim()
			.min(1, { message: 'Email must not be empty' })
			.email({ message: 'Email must be a valid email address' })
			.optional(),
	})
	.refine((data) => data.id || data.email, {
		message: 'Either id or email must be provided',
		path: ['id'],
	});

export type DeleteContactOptionsType = z.infer<typeof DeleteContactOptionsSchema>;
