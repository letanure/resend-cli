import { z } from 'zod';

// No input required for list operation
export const ListAudienceOptionsSchema = z.object({});

export type ListAudienceOptionsType = z.infer<typeof ListAudienceOptionsSchema>;
