import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteBroadcastData } from './schema.js';

interface DeleteBroadcastResponse {
	object: string;
	id: string;
	deleted: boolean;
}

/**
 * Deletes a broadcast using the Resend API
 * Note: You can only delete broadcasts that are in the draft status.
 * If you delete a broadcast that has already been scheduled to be sent,
 * we will automatically cancel the scheduled delivery and it won't be sent.
 *
 * @param data - Broadcast data containing broadcastId
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<DeleteBroadcastResponse>> - Standard result format
 */
export async function deleteBroadcast(
	data: DeleteBroadcastData,
	apiKey: string,
): Promise<ApiResult<DeleteBroadcastResponse>> {
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
			data: responseData as DeleteBroadcastResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete broadcast', data),
		};
	}
}
