import type { CreateEmailOptions, CreateEmailResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Sends an email using the Resend API
 *
 * @param data - Email data matching Resend's CreateEmailOptions interface
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<CreateEmailResponseSuccess>> - Standard result format
 */
export async function sendEmail(
	data: CreateEmailOptions,
	apiKey: string,
): Promise<ApiResult<CreateEmailResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.emails.send(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'send email', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'send email', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'send email', data),
		};
	}
}
