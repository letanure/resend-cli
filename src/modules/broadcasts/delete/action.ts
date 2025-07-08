import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteBroadcastData } from './schema.js';

type RemoveBroadcastData = NonNullable<Awaited<ReturnType<Resend['broadcasts']['remove']>>['data']>;

/**
 * Deletes a broadcast using the Resend API
 *
 * @param data - Broadcast data for deletion
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<RemoveBroadcastResponseSuccess>> - Standard result format
 */
export async function deleteBroadcast(
	data: DeleteBroadcastData,
	apiKey: string,
): Promise<ApiResult<RemoveBroadcastData>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.broadcasts.remove(data.broadcastId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete broadcast', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete broadcast', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete broadcast', data),
		};
	}
}
