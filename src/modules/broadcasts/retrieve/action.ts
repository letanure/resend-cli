import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveBroadcastData } from './schema.js';

type GetBroadcastResponseData = NonNullable<Awaited<ReturnType<Resend['broadcasts']['get']>>['data']>;

/**
 * Retrieves a broadcast using the Resend API
 *
 * @param data - Broadcast data for retrieval
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<GetBroadcastResponseData>> - Standard result format
 */
export async function retrieveBroadcast(
	data: RetrieveBroadcastData,
	apiKey: string,
): Promise<ApiResult<GetBroadcastResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.broadcasts.get(data.broadcastId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'retrieve broadcast', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'retrieve broadcast', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve broadcast', data),
		};
	}
}
