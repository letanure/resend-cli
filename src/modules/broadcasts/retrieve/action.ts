import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveBroadcastData } from './schema.js';

// Type based on API response documentation
interface RetrieveBroadcastResponse {
	object: 'broadcast';
	id: string;
	name: string | null;
	audience_id: string;
	from: string;
	subject: string;
	reply_to: Array<string> | null;
	preview_text: string | null;
	status: 'draft' | 'sent' | 'queued';
	created_at: string;
	scheduled_at: string | null;
	sent_at: string | null;
}

/**
 * Retrieves a broadcast using the Resend API
 *
 * @param data - Broadcast data containing broadcastId
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<RetrieveBroadcastResponse>> - Standard result format
 */
export async function retrieveBroadcast(
	data: RetrieveBroadcastData,
	apiKey: string,
): Promise<ApiResult<RetrieveBroadcastResponse>> {
	try {
		const resend = new Resend(apiKey);

		const { data: responseData, error } = await resend.broadcasts.get(data.broadcastId as string);

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
			data: responseData as RetrieveBroadcastResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve broadcast', data),
		};
	}
}
