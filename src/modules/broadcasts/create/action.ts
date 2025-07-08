import type { CreateBroadcastResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateBroadcastData } from './schema.js';

/**
 * Creates a broadcast using the Resend API
 *
 * @param data - Broadcast data for creation
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<CreateBroadcastResponseSuccess>> - Standard result format
 */
export async function createBroadcast(
	data: CreateBroadcastData,
	apiKey: string,
): Promise<ApiResult<CreateBroadcastResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.broadcasts.create(data as never);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create broadcast', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create broadcast', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create broadcast', data),
		};
	}
}
