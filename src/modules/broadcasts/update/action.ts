import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateBroadcastData } from './schema.js';

// Types based on API documentation
interface BroadcastUpdatePayload {
	id: string;
	audience_id?: string;
	from?: string;
	subject?: string;
	reply_to?: Array<string>;
	html?: string;
	text?: string;
	name?: string;
}

interface UpdateBroadcastResponse {
	id: string;
}

/**
 * Updates a broadcast using the Resend API
 *
 * @param data - Broadcast data containing broadcastId and update parameters
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<UpdateBroadcastResponse>> - Standard result format
 */
export async function updateBroadcast(
	data: UpdateBroadcastData,
	apiKey: string,
): Promise<ApiResult<UpdateBroadcastResponse>> {
	try {
		const resend = new Resend(apiKey);

		// Prepare the update payload according to Resend API format
		const updatePayload: Omit<BroadcastUpdatePayload, 'id'> = {};

		// Add optional parameters if provided
		if (data.audienceId !== undefined) {
			updatePayload.audience_id = data.audienceId;
		}
		if (data.from !== undefined) {
			updatePayload.from = data.from;
		}
		if (data.subject !== undefined) {
			updatePayload.subject = data.subject;
		}
		if (data.replyTo !== undefined) {
			// Convert comma-separated string to array if needed
			if (typeof data.replyTo === 'string') {
				updatePayload.reply_to = data.replyTo.split(',').map((email) => email.trim());
			} else {
				updatePayload.reply_to = data.replyTo as Array<string>;
			}
		}
		if (data.html !== undefined) {
			updatePayload.html = data.html;
		}
		if (data.text !== undefined) {
			updatePayload.text = data.text;
		}
		if (data.name !== undefined) {
			updatePayload.name = data.name;
		}

		const { data: responseData, error } = await resend.broadcasts.update(data.broadcastId as string, updatePayload);

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
			data: responseData as UpdateBroadcastResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update broadcast', data),
		};
	}
}
