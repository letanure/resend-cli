import type { RemoveApiKeyResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteApiKeyData } from './schema.js';

/**
 * Deletes an API key using the Resend API
 *
 * @param data - Delete data containing the API key ID
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<RemoveApiKeyResponseSuccess>> - Standard result format
 */
export async function deleteApiKey(
	data: DeleteApiKeyData,
	apiKey: string,
): Promise<ApiResult<RemoveApiKeyResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.apiKeys.remove(data.api_key_id);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete API key', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete API key', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete API key', data),
		};
	}
}
