import type { ListAudiencesResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Lists audiences using the Resend API
 *
 * @param data - Empty object (no parameters needed for listing)
 * @param apiKey - API key for Resend API (assumed to be valid)
 * @returns Promise<ApiResult<ListAudiencesResponseSuccess>> - Standard result format
 */
export async function listAudiences(
	_data: Record<string, unknown>,
	apiKey: string,
): Promise<ApiResult<ListAudiencesResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.audiences.list();

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list audiences', {}),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list audiences', {}),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list audiences', {}),
		};
	}
}
