import { z } from 'zod';
import {
	createEmailRecipientsSchema,
	createEmailSenderSchema,
	createTextFieldSchema,
	removeEmptyFields,
} from '@/utils/zodTransforms.js';

export const updateBroadcastSchema = z
	.object({
		broadcastId: z
			.string({ required_error: 'Broadcast ID is required' })
			.trim()
			.min(1, { message: 'Broadcast ID is required' }),
		audienceId: createTextFieldSchema(false),
		from: createEmailSenderSchema(false),
		subject: createTextFieldSchema(false),
		replyTo: createEmailRecipientsSchema(50, false),
		html: createTextFieldSchema(false),
		text: createTextFieldSchema(false),
		name: createTextFieldSchema(false),
	})
	.transform((data) => {
		const cleaned = removeEmptyFields(data);
		// Ensure required fields are always present
		return {
			broadcastId: data.broadcastId,
			...cleaned,
		};
	});

export type UpdateBroadcastData = z.infer<typeof updateBroadcastSchema>;
