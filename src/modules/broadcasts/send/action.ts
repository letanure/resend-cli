import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { SendBroadcastData } from './schema.js';

interface SendBroadcastResponse {
	id: string;
}

/**
 * Sends a broadcast using the Resend API
 *
 * @param data - Broadcast data containing broadcastId and optional scheduledAt
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<SendBroadcastResponse>> - Standard result format
 */
export async function sendBroadcast(
	data: SendBroadcastData,
	apiKey: string,
): Promise<ApiResult<SendBroadcastResponse>> {
	try {
		const resend = new Resend(apiKey);

		// Prepare the send payload
		const sendPayload: { scheduledAt?: string } = {};

		if (data.scheduledAt !== undefined) {
			sendPayload.scheduledAt = data.scheduledAt;
		}

		const { data: responseData, error } = await resend.broadcasts.send(data.broadcastId as string, sendPayload);

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
			data: responseData as SendBroadcastResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'send broadcast', data),
		};
	}
}
