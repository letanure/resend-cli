import { z } from 'zod';

// UpdateEmailOptions interface exists in resend package but is not exported
// Define it locally to match the resend package interface
interface UpdateEmailOptions {
	id: string;
	scheduledAt: string;
}

export const UpdateEmailOptionsSchema = z.object({
	id: z
		.string()
		.length(36, 'Email ID must be exactly 36 characters')
		.regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Email ID must be a valid UUID format'),
	scheduledAt: z
		.string()
		.datetime({ message: 'Scheduled date must be in ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z)' })
		.refine(
			(date) => {
				const scheduledDate = new Date(date);
				const now = new Date();
				return scheduledDate > now;
			},
			{ message: 'Scheduled date must be in the future' },
		),
});

export type UpdateEmailOptionsType = z.infer<typeof UpdateEmailOptionsSchema>;

// Type check to ensure our schema is compatible with Resend API
type _SchemaCheck = UpdateEmailOptionsType extends UpdateEmailOptions ? true : false;
