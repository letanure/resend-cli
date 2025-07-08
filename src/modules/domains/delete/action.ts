import { Resend } from 'resend';

type RemoveDomainsResponseData = NonNullable<Awaited<ReturnType<Resend['domains']['remove']>>['data']>;

import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteDomainData } from './schema.js';

/**
 * Deletes a domain using the Resend API
 *
 * @param data - Domain data for deletion
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<any>> - Standard result format
 */
export async function deleteDomain(
	data: DeleteDomainData,
	apiKey: string,
): Promise<ApiResult<RemoveDomainsResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.domains.remove(data.domainId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete domain', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete domain', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete domain', data),
		};
	}
}
