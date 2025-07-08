import type { CreateAudienceResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateAudienceOptionsType } from './schema.js';

/**
 * Creates an audience using the Resend API
 *
 * @param data - Audience data for creation
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<CreateAudienceResponseSuccess>> - Standard result format
 */
export async function createAudience(
	data: CreateAudienceOptionsType,
	apiKey: string,
): Promise<ApiResult<CreateAudienceResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.audiences.create(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create audience', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create audience', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create audience', data),
		};
	}
}
