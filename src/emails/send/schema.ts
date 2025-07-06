import { z } from 'zod';
import { validateScheduledAt } from '../../utils/validations.js';

export const CreateEmailOptionsSchema = z
	.object({
		to: z.union([z.string().email(), z.array(z.string().email())]).refine(
			(val) => {
				if (Array.isArray(val)) {
					return val.length <= 50;
				}
				return true;
			},
			{
				message: 'You can specify up to 50 recipients only',
			},
		),
		from: z.string().regex(/^([^<>]+<)?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}>?$/, {
			message: "Must be a valid email or 'Name <email@domain.com>' format",
		}),
		subject: z.string(),
		bcc: z.union([z.string(), z.array(z.string())]).optional(),
		cc: z.union([z.string(), z.array(z.string())]).optional(),
		scheduled_at: z.string().optional().superRefine(validateScheduledAt),
		reply_to: z.union([z.string().email(), z.array(z.string().email())]).optional(),
		html: z.string().optional(),
		text: z.string().optional(),
		// react:
		headers: z.record(z.string(), z.string()).optional(),
		attachments: z
			.array(
				z.object({
					content: z.string(),
					filename: z.string(),
					path: z.string().optional(),
					content_type: z.string().optional(),
				}),
			)
			.optional(),

		tags: z
			.array(
				z.object({
					name: z.string(),
					value: z.string(),
				}),
			)
			.optional(),
	})
	.refine((data) => data.html || data.text, {
		message: 'Either html or text must be provided',
	});

export type CreateEmailOptionsType = z.infer<typeof CreateEmailOptionsSchema>;
