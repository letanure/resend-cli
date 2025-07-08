import { z } from 'zod';

// Domains list doesn't require any input parameters
export const ListDomainsOptionsSchema = z.object({});

export type ListDomainsOptionsType = z.infer<typeof ListDomainsOptionsSchema>;
