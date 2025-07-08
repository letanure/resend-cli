import { Resend } from 'resend';

type UpdateDomainsResponseData = NonNullable<Awaited<ReturnType<Resend['domains']['update']>>['data']>;

import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateDomainData } from './schema.js';

/**
 * Updates a domain using the Resend API
 *
 * @param data - Domain data for update
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<any>> - Standard result format
 */
export async function updateDomain(
	data: UpdateDomainData,
	apiKey: string,
): Promise<ApiResult<UpdateDomainsResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { domainId, ...updateData } = data;
		const { data: responseData, error } = await resend.domains.update({
			...updateData,
			id: domainId,
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'update domain', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'update domain', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update domain', data),
		};
	}
}
