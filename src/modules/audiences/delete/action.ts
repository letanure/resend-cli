import type { RemoveAudiencesResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteAudienceOptionsType } from './schema.js';

/**
 * Deletes an audience using the Resend API
 *
 * @param data - Audience data for deletion
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<RemoveAudiencesResponseSuccess>> - Standard result format
 */
export async function deleteAudience(
	data: DeleteAudienceOptionsType,
	apiKey: string,
): Promise<ApiResult<RemoveAudiencesResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.audiences.remove(data.id);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete audience', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete audience', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete audience', data),
		};
	}
}
