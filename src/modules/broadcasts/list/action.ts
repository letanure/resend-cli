import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { ListBroadcastsData } from './schema.js';

type ListBroadcastsResponseData = NonNullable<Awaited<ReturnType<Resend['broadcasts']['list']>>['data']>;

/**
 * Lists all broadcasts using the Resend API
 *
 * @param data - Data for listing broadcasts
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<ListBroadcastsResponseSuccess>> - Standard result format
 */
export async function listBroadcasts(
	data: ListBroadcastsData,
	apiKey: string,
): Promise<ApiResult<ListBroadcastsResponseData>> {
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
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list broadcasts', data),
		};
	}
}
