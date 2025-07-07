import { z } from 'zod';

// Input schema for list contacts operation
export const ListContactsOptionsSchema = z.object({
	audience_id: z.string().min(1, 'Audience ID is required').uuid('Audience ID must be a valid UUID'),
});

export type ListContactsOptionsType = z.infer<typeof ListContactsOptionsSchema>;
