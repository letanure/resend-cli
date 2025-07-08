import type { CreateApiKeyOptions, CreateApiKeyResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateApiKeyOptionsType } from './schema.js';

/**
 * Creates an API key using the Resend API
 *
 * @param data - API key data for creation
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<CreateApiKeyResponseSuccess>> - Standard result format
 */
export async function createApiKey(
	data: CreateApiKeyOptionsType,
	apiKey: string,
): Promise<ApiResult<CreateApiKeyResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.apiKeys.create(data as CreateApiKeyOptions);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create API key', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create API key', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create API key', data),
		};
	}
}
