import type { RemoveAudiencesResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteAudienceOptionsType } from './schema.js';

/**
 * Deletes an audience using the Resend API
 *
 * @param audienceData - Audience data containing id
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<RemoveAudiencesResponseSuccess>> - Standard result format
 */
export async function deleteAudience(
	audienceData: DeleteAudienceOptionsType,
	apiKey: string,
): Promise<ApiResult<RemoveAudiencesResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.audiences.remove(audienceData.id);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete audience', audienceData),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete audience', audienceData),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete audience', audienceData),
		};
	}
}
