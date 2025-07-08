import type { SendBroadcastResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { SendBroadcastData } from './schema.js';

/**
 * Sends a broadcast using the Resend API
 *
 * @param data - Broadcast data for sending
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<SendBroadcastResponseSuccess>> - Standard result format
 */
export async function sendBroadcast(
	data: SendBroadcastData,
	apiKey: string,
): Promise<ApiResult<SendBroadcastResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.broadcasts.send(data.broadcastId, data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'send broadcast', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'send broadcast', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'send broadcast', data),
		};
	}
}
