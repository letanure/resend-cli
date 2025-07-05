import type { CreateEmailOptions } from 'resend';
import { Resend } from 'resend';

export interface SendEmailArgs {
	from: string;
	to: string | Array<string>;
	subject: string;
	html?: string;
	text?: string;
	apiKey?: string;
}

export interface SendEmailResult {
	success: boolean;
	message?: string;
	error?: string;
	data?: {
		id: string;
	};
}

export async function sendEmailAction(args: SendEmailArgs): Promise<SendEmailResult> {
	try {
		// Get API key from args or environment
		const apiKey = args.apiKey || process.env.RESEND_API_KEY;

		if (!apiKey) {
			return {
				success: false,
				error: 'API key is required. Provide it via --apiKey flag or set RESEND_API_KEY environment variable.',
			};
		}

		// Initialize Resend client
		const resend = new Resend(apiKey);

		// Prepare email options (using Resend's interface directly)
		const emailOptions: CreateEmailOptions = {
			from: args.from,
			to: args.to,
			subject: args.subject,
			...(args.html && { html: args.html }),
			...(args.text && { text: args.text }),
		} as CreateEmailOptions;

		// Send email
		// biome-ignore lint/suspicious/noExplicitAny: Resend type compatibility issue
		const { data, error } = await resend.emails.send(emailOptions as any);

		if (error) {
			return {
				success: false,
				error: `Failed to send email: ${error.message}`,
			};
		}

		return {
			success: true,
			message: 'Email sent successfully!',
			data: {
				id: data?.id || '',
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
}
