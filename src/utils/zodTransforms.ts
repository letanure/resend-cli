import { z } from 'zod';

/**
 * Zod transformation utilities for common data cleaning operations
 */

/**
 * Removes undefined and empty string fields from an object
 * Useful as a final transform step in Zod schemas to clean up API payloads
 *
 * @example
 * const schema = z.object({...}).transform(removeEmptyFields);
 */
export const removeEmptyFields = <T extends Record<string, unknown>>(data: T): Partial<T> => {
	const cleaned: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		if (value !== undefined && value !== '') {
			cleaned[key] = value;
		}
	}
	return cleaned as Partial<T>;
};

/**
 * Creates a Zod schema for email recipient fields that supports:
 * - Single email: "user@domain.com"
 * - Multiple comma-separated emails: "user1@domain.com, user2@domain.com"
 * - Array of emails: ["user1@domain.com", "user2@domain.com"]
 *
 * @param maxRecipients Maximum number of recipients allowed (default: 50)
 * @param required Whether the field is required (default: false)
 *
 * @example
 * // Required field with default 50 recipient limit
 * to: createEmailRecipientsSchema(50, true)
 *
 * // Optional field with custom limit
 * cc: createEmailRecipientsSchema(10, false)
 */
export const createEmailRecipientsSchema = (maxRecipients = 50, required = false) => {
	const baseSchema = z.union([
		z
			.string()
			.min(1, 'Required')
			.superRefine((val, ctx) => {
				if (val.includes(',')) {
					const emails = val
						.split(',')
						.map((s) => s.trim())
						.filter((s) => s.length > 0);
					if (emails.length > maxRecipients) {
						ctx.addIssue({
							code: 'custom',
							message: `You can specify up to ${maxRecipients} recipients only`,
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
			.max(maxRecipients, `You can specify up to ${maxRecipients} recipients only`),
		z.undefined(),
	]);

	return required ? baseSchema.refine((val) => val !== undefined, { message: 'Required' }) : baseSchema;
};

/**
 * Creates a Zod schema for email sender fields that accepts SINGLE emails only in these formats:
 * - Simple email: "user@domain.com"
 * - Named email: "John Doe <user@domain.com>"
 *
 * Note: Unlike recipients schema, this does NOT support comma-separated multiple emails
 *
 * @param required Whether the field is required (default: true)
 *
 * @example
 * // Required sender field (typical for 'from' field)
 * from: createEmailSenderSchema(true)
 *
 * // Optional sender field
 * from: createEmailSenderSchema(false)
 */
export const createEmailSenderSchema = (required = true) => {
	const baseSchema = z.union([
		z
			.string()
			.min(1, 'Required')
			.regex(/^([^<>]+<)?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}>?$/, {
				message: "Must be a valid email or 'Name <email@domain.com>' format",
			}),
		z.undefined(),
	]);

	return required ? baseSchema.refine((val) => val !== undefined, { message: 'Required' }) : baseSchema;
};

/**
 * Creates a Zod schema for simple text fields
 *
 * @param required Whether the field is required (default: true)
 *
 * @example
 * // Required text field
 * subject: createTextFieldSchema(true)
 *
 * // Optional text field
 * subject: createTextFieldSchema(false)
 */
export const createTextFieldSchema = (required = true) => {
	const baseSchema = z.union([z.string().min(1, 'Required'), z.undefined()]);

	return required ? baseSchema.refine((val) => val !== undefined, { message: 'Required' }) : baseSchema;
};
