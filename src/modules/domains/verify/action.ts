import { Resend } from 'resend';

type VerifyDomainsResponseData = NonNullable<Awaited<ReturnType<Resend['domains']['verify']>>['data']>;

import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { VerifyDomainData } from './schema.js';

/**
 * Verifies a domain using the Resend API
 *
 * @param data - Domain data for verification
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<any>> - Standard result format
 */
export async function verifyDomain(
	data: VerifyDomainData,
	apiKey: string,
): Promise<ApiResult<VerifyDomainsResponseData>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.domains.verify(data.domainId);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'verify domain', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'verify domain', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'verify domain', data),
		};
	}
}
