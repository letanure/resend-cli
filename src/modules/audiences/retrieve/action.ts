import type { GetAudienceResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveAudienceOptionsType } from './schema.js';

/**
 * Retrieves an audience using the Resend API
 *
 * @param audienceData - Audience data containing id
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<GetAudienceResponseSuccess>> - Standard result format
 */
export async function retrieveAudience(
	audienceData: RetrieveAudienceOptionsType,
	apiKey: string,
): Promise<ApiResult<GetAudienceResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.audiences.get(audienceData.id);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'retrieve audience', audienceData),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'retrieve audience', audienceData),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve audience', audienceData),
		};
	}
}
