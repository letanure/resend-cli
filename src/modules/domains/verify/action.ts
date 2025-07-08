import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { VerifyDomainData } from './schema.js';

// Type for the verify domain response based on API documentation
interface VerifyDomainResponse {
	object: 'domain';
	id: string;
}

/**
 * Verifies a domain using the Resend API
 *
 * @param data - Domain data containing domainId
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<VerifyDomainResponse>> - Standard result format
 */
export async function verifyDomain(data: VerifyDomainData, apiKey: string): Promise<ApiResult<VerifyDomainResponse>> {
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
			data: responseData as VerifyDomainResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'verify domain', data),
		};
	}
}
