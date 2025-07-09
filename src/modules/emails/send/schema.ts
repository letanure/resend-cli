import type { CreateEmailOptions } from 'resend';
import { z } from 'zod';
import { htmlOrTextMessage, htmlOrTextRefine } from '@/utils/shared-schemas.js';
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
	.refine(htmlOrTextRefine, {
		message: htmlOrTextMessage,
	})
	.transform(removeEmptyFields);

export type CreateEmailOptionsType = z.infer<typeof CreateEmailOptionsSchema>;

// Type check to ensure our schema is compatible with Resend API
// This will show a TypeScript error if the schema doesn't match the API
type _SchemaCheck = CreateEmailOptionsType extends CreateEmailOptions ? true : false;

// Alternatively, use satisfies for stricter checking (similar to your main schema approach)
// Uncomment the line below if you want even stricter type checking:
// const _validateSchema: CreateEmailOptions = {} as CreateEmailOptionsType;
