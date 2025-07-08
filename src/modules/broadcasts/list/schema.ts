import { z } from 'zod';

// List broadcasts has no input parameters - it just lists all broadcasts
export const listBroadcastsSchema = z.object({});

export type ListBroadcastsData = z.infer<typeof listBroadcastsSchema>;
