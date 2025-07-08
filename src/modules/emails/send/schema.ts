import { z } from 'zod';
import { validatescheduledAt } from '@/utils/validations.js';
import {
	createEmailRecipientsSchema,
	createEmailSenderSchema,
	createTextFieldSchema,
	removeEmptyFields,
} from '@/utils/zodTransforms.js';

export const CreateEmailOptionsSchema = z
	.object({
		to: createEmailRecipientsSchema(50, true),
		from: createEmailSenderSchema(true),
		subject: createTextFieldSchema(true),
		bcc: createEmailRecipientsSchema(50, false),
		cc: createEmailRecipientsSchema(50, false),
		scheduledAt: z.string().optional().superRefine(validatescheduledAt),
		replyTo: createEmailRecipientsSchema(50, false),
		html: createTextFieldSchema(false),
		text: createTextFieldSchema(false),
		// react:
		headers: z.record(z.string(), z.string()).optional(),
		attachments: z
			.array(
				z.object({
					content: z.string(),
					filename: z.string(),
					path: z.string().optional(),
					content_type: z.string().optional(),
				}),
			)
			.optional(),

		tags: z
			.array(
				z.object({
					name: z.string(),
					value: z.string(),
				}),
			)
			.optional(),
	})
	.refine((data) => data.html || data.text, {
		message: 'Either html or text must be provided',
	})
	.transform(removeEmptyFields);

export type CreateEmailOptionsType = z.infer<typeof CreateEmailOptionsSchema>;
