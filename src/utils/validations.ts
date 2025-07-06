import { z } from 'zod';

export function validateScheduledAt(val: string | undefined, ctx: z.RefinementCtx) {
	if (!val) {
		return;
	}

	const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

	if (isoPattern.test(val)) {
		const timestamp = Date.parse(val);
		if (Number.isNaN(timestamp)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid ISO 8601 date format',
			});
			return;
		}
		if (timestamp <= Date.now()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Scheduled date must be in the future',
			});
		}
		return;
	}

	if (val.length < 3) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Natural language date must be at least 3 characters',
		});
	}
}
