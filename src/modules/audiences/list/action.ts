import type { ListAudiencesResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Lists audiences using the Resend API
 *
 * @param data - Data for listing audiences
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<ListAudiencesResponseSuccess>> - Standard result format
 */
export async function listAudiences(
	data: Record<string, unknown>,
	apiKey: string,
): Promise<ApiResult<ListAudiencesResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.audiences.list();

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list audiences', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list audiences', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list audiences', data),
		};
	}
}
