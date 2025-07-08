import type { GetEmailResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Retrieves an email using the Resend API
 *
 * @param emailId - Email ID for retrieval
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<GetEmailResponseSuccess>> - Standard result format
 */
export async function getEmail(emailId: string, apiKey: string): Promise<ApiResult<GetEmailResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.emails.get(emailId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'get email', { emailId }),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'get email', { emailId }),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'get email', { emailId }),
		};
	}
}
