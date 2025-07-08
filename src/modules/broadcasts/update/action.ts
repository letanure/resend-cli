import { Resend } from 'resend';

type UpdateBroadcastResponseData = NonNullable<Awaited<ReturnType<Resend['broadcasts']['update']>>['data']>;

import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateBroadcastData } from './schema.js';

/**
 * Updates a broadcast using the Resend API
 *
 * @param data - Broadcast data for update
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<UpdateBroadcastResponseData>> - Standard result format
 */
export async function updateBroadcast(
	data: UpdateBroadcastData,
	apiKey: string,
): Promise<ApiResult<UpdateBroadcastResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { broadcastId, ...updateData } = data;
		const { data: responseData, error } = await resend.broadcasts.update(broadcastId, updateData as never);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'update broadcast', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'update broadcast', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update broadcast', data),
		};
	}
}
