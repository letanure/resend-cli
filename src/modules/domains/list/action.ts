import type { ListDomainsResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { ListDomainsOptionsType } from './schema.js';

/**
 * Lists all domains using the Resend API
 *
 * @param data - Data for listing domains
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<ListDomainsResponseSuccess>> - Standard result format
 */
export async function listDomains(
	data: ListDomainsOptionsType,
	apiKey: string,
): Promise<ApiResult<ListDomainsResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.domains.list();

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list domains', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list domains', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list domains', data),
		};
	}
}
