import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Cancels a scheduled email using the Resend API
 *
 * @param emailId - The email ID to cancel
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<{ id: string; object: string }>> - Standard result format
 */
export async function cancelEmail(emailId: string, apiKey: string): Promise<ApiResult<{ id: string; object: string }>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.emails.cancel(emailId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'cancel email', { id: emailId }),
			};
		}

		return {
			success: true,
			data: data || { id: emailId, object: 'email' },
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'cancel email', { id: emailId }),
		};
	}
}
