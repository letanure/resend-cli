import type { CreateEmailOptions } from 'resend';
import { Resend } from 'resend';
import { formatResendError } from '../../utils/resendErrors.js';

/**
 * Standard API result format used across all endpoints
 */
export interface ApiResult<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
	debug?: {
		request?: unknown;
		response?: unknown;
	};
}

/**
 * Successful email send response data
 */
export interface EmailSendData {
	id: string;
}

/**
 * Sends an email using the Resend API
 *
 * @param emailData - Email data matching Resend's CreateEmailOptions interface
 * @param apiKey - Optional API key, falls back to RESEND_API_KEY environment variable
 * @returns Promise<ApiResult<EmailSendData>> - Standard result format
 */
export async function sendEmailAction(
	emailData: CreateEmailOptions,
	apiKey?: string,
): Promise<ApiResult<EmailSendData>> {
	try {
		const resolvedApiKey = apiKey || process.env.RESEND_API_KEY;

		if (!resolvedApiKey) {
			return {
				success: false,
				error: 'API key is required. Provide it via parameter or set RESEND_API_KEY environment variable.',
			};
		}

		const resend = new Resend(resolvedApiKey);
		const { data, error } = await resend.emails.send(emailData);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'send email', emailData),
			};
		}

		if (!data?.id) {
			return {
				success: false,
				error: 'Email sent but no ID returned from Resend API',
			};
		}

		return {
			success: true,
			data: {
				id: data.id,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'send email', emailData),
		};
	}
}
