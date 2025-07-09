import { z } from 'zod';

// Define the expected API type (cancel just takes an id parameter)
export interface CancelEmailOptions {
	id: string;
}

export const CancelEmailOptionsSchema = z.object({
	id: z
		.string()
		.length(36, 'Email ID must be exactly 36 characters')
		.regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Email ID must be a valid UUID format'),
});

export type CancelEmailOptionsType = z.infer<typeof CancelEmailOptionsSchema>;

// Type check to ensure our schema is compatible with Resend API
type _SchemaCheck = CancelEmailOptionsType extends CancelEmailOptions ? true : false;
