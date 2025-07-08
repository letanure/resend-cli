import type { GetAudienceResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveAudienceOptionsType } from './schema.js';

/**
 * Retrieves an audience using the Resend API
 *
 * @param data - Audience data for retrieval
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<GetAudienceResponseSuccess>> - Standard result format
 */
export async function retrieveAudience(
	data: RetrieveAudienceOptionsType,
	apiKey: string,
): Promise<ApiResult<GetAudienceResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.audiences.get(data.id);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'retrieve audience', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'retrieve audience', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve audience', data),
		};
	}
}
