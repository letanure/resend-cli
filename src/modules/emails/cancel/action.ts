import { Resend } from 'resend';

type CancelEmailResponseData = NonNullable<Awaited<ReturnType<Resend['emails']['cancel']>>['data']>;

import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Cancels a scheduled email using the Resend API
 *
 * @param emailId - Email ID for cancellation
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<CancelEmailResponseData>> - Standard result format
 */
export async function cancelEmail(emailId: string, apiKey: string): Promise<ApiResult<CancelEmailResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.emails.cancel(emailId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'cancel email', { emailId }),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'cancel email', { emailId }),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'cancel email', { emailId }),
		};
	}
}
