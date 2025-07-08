import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { ListBroadcastsData } from './schema.js';

interface BroadcastItem {
	id: string;
	audience_id: string;
	status: 'draft' | 'sent' | 'queued';
	created_at: string;
	scheduled_at: string | null;
	sent_at: string | null;
}

interface ListBroadcastsResponse {
	object: 'list';
	data: Array<BroadcastItem>;
}

/**
 * Lists all broadcasts using the Resend API
 *
 * @param data - Empty object (no parameters needed for listing)
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<ListBroadcastsResponse>> - Standard result format
 */
export async function listBroadcasts(
	data: ListBroadcastsData,
	apiKey: string,
): Promise<ApiResult<ListBroadcastsResponse>> {
	try {
		const resend = new Resend(apiKey);

		const { data: responseData, error } = await resend.broadcasts.list();

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list broadcasts', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list broadcasts', data),
			};
		}

		return {
			success: true,
			data: responseData as ListBroadcastsResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list broadcasts', data),
		};
	}
}
