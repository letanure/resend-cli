import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteDomainData } from './schema.js';

// Type for the delete domain response based on API documentation
interface DeleteDomainResponse {
	object: 'domain';
	id: string;
	deleted: true;
}

/**
 * Deletes a domain using the Resend API
 *
 * @param data - Domain data containing domainId
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<DeleteDomainResponse>> - Standard result format
 */
export async function deleteDomain(data: DeleteDomainData, apiKey: string): Promise<ApiResult<DeleteDomainResponse>> {
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
			data: responseData as DeleteDomainResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete domain', data),
		};
	}
}
