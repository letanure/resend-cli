import type { ListApiKeysResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';

/**
 * Lists API keys using the Resend API
 *
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<ListApiKeysResponseSuccess>> - Standard result format
 */
export async function listApiKeys(apiKey: string): Promise<ApiResult<ListApiKeysResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.apiKeys.list();

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list API keys', {}),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list API keys', {}),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list API keys', {}),
		};
	}
}
