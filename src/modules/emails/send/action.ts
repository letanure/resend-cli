import type { CreateEmailOptions, CreateEmailResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Sends an email using the Resend API
 *
 * @param emailData - Email data matching Resend's CreateEmailOptions interface
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<EmailSendData>> - Standard result format
 */
export async function sendEmail(
	emailData: CreateEmailOptions,
	apiKey: string,
): Promise<ApiResult<CreateEmailResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.emails.send(emailData);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'send email', emailData),
			};
		}

		return {
			success: true,
			data: data as CreateEmailResponseSuccess,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'send email', emailData),
		};
	}
}
