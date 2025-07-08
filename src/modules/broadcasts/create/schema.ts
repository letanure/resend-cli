import { z } from 'zod';
import {
	createEmailRecipientsSchema,
	createEmailSenderSchema,
	createTextFieldSchema,
	removeEmptyFields,
} from '@/utils/zodTransforms.js';

export const createBroadcastSchema = z
	.object({
		audienceId: z
			.string({ required_error: 'Audience ID is required' })
			.trim()
			.min(1, { message: 'Audience ID is required' }),
		from: createEmailSenderSchema(true),
		subject: createTextFieldSchema(true),
		replyTo: createEmailRecipientsSchema(50, false),
		html: createTextFieldSchema(false),
		text: createTextFieldSchema(false),
		name: createTextFieldSchema(false),
	})
	.refine((data) => data.html || data.text, {
		message: 'Either html or text must be provided',
	})
	.transform((data) => {
		const cleaned = removeEmptyFields(data);
		// Ensure required fields are always present
		return {
			audienceId: data.audienceId,
			from: data.from,
			subject: data.subject,
			...cleaned,
		};
	});

export type CreateBroadcastData = z.infer<typeof createBroadcastSchema>;
