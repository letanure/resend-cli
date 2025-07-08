import { z } from 'zod';

// No input required for list operation
export const ListOptionsSchema = z.object({});

export type ListOptionsType = z.infer<typeof ListOptionsSchema>;
