import { z } from 'zod';

export const CreateApiKeyOptionsSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, { message: 'API key name is required' })
			.max(100, { message: 'API key name must be less than 100 characters' }),
		permission: z.enum(['full_access', 'sending_access'], {
			required_error: 'Permission is required',
			invalid_type_error: 'Permission must be either full_access or sending_access',
		}),
		domain_id: z
			.string()
			.trim()
			.min(1, { message: 'Domain ID must not be empty' })
			.uuid({ message: 'Domain ID must be a valid UUID' })
			.optional(),
	})
	.transform((data) => {
		// If permission is full_access, clear domain_id
		if (data.permission === 'full_access') {
			return { ...data, domain_id: undefined };
		}
		return data;
	});

export type CreateApiKeyOptionsType = z.infer<typeof CreateApiKeyOptionsSchema>;
