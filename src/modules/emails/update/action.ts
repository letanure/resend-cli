import { Resend } from 'resend';

type UpdateEmailResponseData = NonNullable<Awaited<ReturnType<Resend['emails']['update']>>['data']>;

import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateEmailOptionsType } from './schema.js';

/**
 * Updates a scheduled email using the Resend API
 *
 * @param data - Email data for update
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<UpdateEmailResponseData>> - Standard result format
 */
export async function updateEmail(
	data: UpdateEmailOptionsType,
	apiKey: string,
): Promise<ApiResult<UpdateEmailResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.emails.update(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'update email', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'update email', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update email', data),
		};
	}
}
