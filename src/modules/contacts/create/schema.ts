import { z } from 'zod';

// Transform string "true"/"false" to boolean
const booleanTransform = z.union([z.boolean(), z.string()]).transform((val) => {
	if (typeof val === 'boolean') {
		return val;
	}
	return val.toLowerCase() === 'true';
});

export const CreateContactOptionsSchema = z.object({
	email: z.string().email('Invalid email address'),
	audienceId: z.string().min(1, 'Audience ID is required'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	unsubscribed: booleanTransform.default(false),
});

export type CreateContactOptionsType = z.infer<typeof CreateContactOptionsSchema>;
