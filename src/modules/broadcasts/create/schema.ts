import { z } from 'zod';
import { htmlOrTextMessage, htmlOrTextRefine } from '@/utils/shared-schemas.js';
import { createEmailRecipientsSchema, createEmailSenderSchema, createTextFieldSchema } from '@/utils/zodTransforms.js';

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
	.refine(htmlOrTextRefine, {
		message: htmlOrTextMessage,
	});

export type CreateBroadcastData = z.infer<typeof createBroadcastSchema>;
