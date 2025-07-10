import { z } from 'zod';
import { createTextFieldSchema } from '@/utils/zodTransforms.js';

export const RetrieveContactOptionsSchema = z
	.object({
		audienceId: createTextFieldSchema(true),
		id: createTextFieldSchema(false),
		email: z.string().email('Invalid email address').optional(),
	})
	.refine((data) => data.id || data.email, {
		message: 'Either id or email must be provided',
		path: ['id'],
	});

export type RetrieveContactOptionsType = z.infer<typeof RetrieveContactOptionsSchema>;
