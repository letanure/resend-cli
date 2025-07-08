import { z } from 'zod';

export const deleteBroadcastSchema = z.object({
	broadcastId: z
		.string({ required_error: 'Broadcast ID is required' })
		.trim()
		.min(1, { message: 'Broadcast ID is required' }),
});

export type DeleteBroadcastData = z.infer<typeof deleteBroadcastSchema>;
