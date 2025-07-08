import { z } from 'zod';
import { removeEmptyFields } from '@/utils/zodTransforms.js';

export const updateContactSchema = z
	.object({
		audienceId: z
			.string({ required_error: 'Audience ID is required' })
			.trim()
			.min(1, { message: 'Audience ID is required' }),
		id: z.string().trim().optional(),
		email: z.string().trim().email('Invalid email address').optional(),
		firstName: z.string().trim().optional(),
		lastName: z.string().trim().optional(),
		unsubscribed: z.boolean().optional(),
	})
	.refine((data) => data.id || data.email, {
		message: 'Either contact ID or email must be provided',
		path: ['id'],
	})
	.transform((data) => {
		const cleaned = removeEmptyFields(data);
		return {
			audienceId: data.audienceId,
			...cleaned,
		};
	});

export type UpdateContactData = z.infer<typeof updateContactSchema>;
