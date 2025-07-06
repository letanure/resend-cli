import { z } from 'zod';
import { validateScheduledAt } from '../../utils/validations.js';

export const CreateEmailOptionsSchema = z
	.object({
		to: z
			.union([
				z
					.string()
					.min(1, 'Required')
					.superRefine((val, ctx) => {
						if (val.includes(',')) {
							const emails = val
								.split(',')
								.map((s) => s.trim())
								.filter((s) => s.length > 0);
							if (emails.length > 50) {
								ctx.addIssue({
									code: 'custom',
									message: 'You can specify up to 50 recipients only',
								});
								return;
							}

							const invalidEmails = emails.filter((email) => !z.string().email().safeParse(email).success);
							if (invalidEmails.length > 0) {
								ctx.addIssue({
									code: 'custom',
									message: 'Must be valid email address(es)',
								});
								return;
							}
						} else if (!z.string().email().safeParse(val).success) {
							ctx.addIssue({
								code: 'custom',
								message: 'Must be a valid email address',
							});
							return;
						}
					}),
				z
					.array(z.string().email('Must contain valid email addresses'))
					.max(50, 'You can specify up to 50 recipients only'),
				z.undefined(),
			])
			.refine((val) => val !== undefined, { message: 'Required' }),
		from: z
			.union([
				z
					.string()
					.min(1, 'Required')
					.regex(/^([^<>]+<)?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}>?$/, {
						message: "Must be a valid email or 'Name <email@domain.com>' format",
					}),
				z.undefined(),
			])
			.refine((val) => val !== undefined, { message: 'Required' }),
		subject: z
			.union([z.string().min(1, 'Required'), z.undefined()])
			.refine((val) => val !== undefined, { message: 'Required' }),
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
