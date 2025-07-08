import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteApiKeyData } from './schema.js';

/**
 * Deletes an API key using the Resend API
 *
 * @param apiKey - API key for Resend API
 * @param data - Delete data containing the API key ID
 * @returns Promise<ApiResult<{ message: string }>> - Standard result format
 */
export async function deleteApiKey(apiKey: string, data: DeleteApiKeyData): Promise<ApiResult<{ message: string }>> {
	try {
		const resend = new Resend(apiKey);
		const { error } = await resend.apiKeys.remove(data.api_key_id);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete API key', data),
			};
		}

		return {
			success: true,
			data: { message: `API key ${data.api_key_id} deleted successfully` },
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete API key', data),
		};
	}
}
