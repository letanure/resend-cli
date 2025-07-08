import { z } from 'zod';

export const retrieveBroadcastSchema = z.object({
	broadcastId: z
		.string({ required_error: 'Broadcast ID is required' })
		.trim()
		.min(1, { message: 'Broadcast ID is required' }),
});

export type RetrieveBroadcastData = z.infer<typeof retrieveBroadcastSchema>;
