import { z } from 'zod';

export const sendBroadcastSchema = z.object({
	broadcastId: z
		.string({ required_error: 'Broadcast ID is required' })
		.trim()
		.min(1, { message: 'Broadcast ID is required' }),
	scheduledAt: z.string().optional(),
});

export type SendBroadcastData = z.infer<typeof sendBroadcastSchema>;
