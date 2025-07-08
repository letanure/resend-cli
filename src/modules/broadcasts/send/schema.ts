import { z } from 'zod';
import { removeEmptyFields } from '@/utils/zodTransforms.js';

export const sendBroadcastSchema = z
	.object({
		broadcastId: z
			.string({ required_error: 'Broadcast ID is required' })
			.trim()
			.min(1, { message: 'Broadcast ID is required' }),
		scheduledAt: z.string().optional(),
	})
	.transform((data) => {
		const cleaned = removeEmptyFields(data);
		return {
			broadcastId: data.broadcastId,
			...cleaned,
		};
	});

export type SendBroadcastData = z.infer<typeof sendBroadcastSchema>;
