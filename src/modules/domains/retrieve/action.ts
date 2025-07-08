import type { GetDomainResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveDomainData } from './schema.js';

/**
 * Retrieves a domain using the Resend API
 *
 * @param data - Domain data containing domainId
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<GetDomainResponseSuccess>> - Standard result format
 */
export async function retrieveDomain(
	data: RetrieveDomainData,
	apiKey: string,
): Promise<ApiResult<GetDomainResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.domains.get(data.domainId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'retrieve domain', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'retrieve domain', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve domain', data),
		};
	}
}
