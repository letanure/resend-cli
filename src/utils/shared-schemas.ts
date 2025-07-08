import { z } from 'zod';

/**
 * Shared validation patterns that are actually used in multiple schemas
 */

// Email validation used in contacts schemas
export const emailSchema = z.string().email('Invalid email address');

// Either/or validation for contact schemas (id OR email)
export const contactIdentifierSchema = z
	.object({
		id: z.string().trim().uuid('Contact ID must be a valid UUID').optional(),
		email: emailSchema.optional(),
	})
	.refine((data) => data.id || data.email, {
		message: 'Either contact ID or email is required',
	});

// HTML or text content validation for emails/broadcasts
export const htmlOrTextRefine = (data: { html?: unknown; text?: unknown }) => data.html || data.text;
export const htmlOrTextMessage = 'Either html or text must be provided';
