import type { GetEmailResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Retrieve a single email by ID from Resend API
 * @param emailId - The unique identifier of the email to retrieve
 * @param apiKey - Resend API key
 * @returns Promise resolving to API result with email data
 */
export async function getEmail(emailId: string, apiKey: string): Promise<ApiResult<GetEmailResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.emails.get(emailId);
		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'get email', { emailId }),
			};
		}

		if (!data) {
			return {
				success: false,
				error: 'No email data returned from API',
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'get email', { emailId }),
		};
	}
}
