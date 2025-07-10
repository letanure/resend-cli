import { z } from 'zod';

export const CreateContactOptionsSchema = z.object({
	email: z.string().email('Invalid email address'),
	audienceId: z.string().min(1, 'Audience ID is required'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	unsubscribed: z
		.union([z.string(), z.boolean()])
		.transform((val) => {
			if (typeof val === 'string') {
				return val === 'true';
			}
			return val;
		})
		.default(false),
});

export type CreateContactOptionsType = z.infer<typeof CreateContactOptionsSchema>;
