import { z } from 'zod';

export const deleteApiKeySchema = z.object({
	api_key_id: z.string().trim().min(1, { message: 'API Key ID is required' }),
});

export type DeleteApiKeyData = z.infer<typeof deleteApiKeySchema>;
