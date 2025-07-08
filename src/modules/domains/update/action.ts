import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateDomainData } from './schema.js';

// Type for the update domain response based on API documentation
interface UpdateDomainResponse {
	object: 'domain';
	id: string;
}

/**
 * Updates a domain using the Resend API
 *
 * @param data - Domain data containing domainId and update parameters
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<UpdateDomainResponse>> - Standard result format
 */
export async function updateDomain(data: UpdateDomainData, apiKey: string): Promise<ApiResult<UpdateDomainResponse>> {
	try {
		const resend = new Resend(apiKey);

		// Prepare the update payload according to Resend API format
		const updatePayload: {
			id: string;
			clickTracking?: boolean;
			openTracking?: boolean;
			tls?: 'opportunistic' | 'enforced';
		} = {
			id: data.domainId,
		};

		// Add optional parameters if provided
		if (data.clickTracking !== undefined) {
			updatePayload.clickTracking = data.clickTracking;
		}
		if (data.openTracking !== undefined) {
			updatePayload.openTracking = data.openTracking;
		}
		if (data.tls !== undefined) {
			updatePayload.tls = data.tls;
		}

		const { data: responseData, error } = await resend.domains.update(updatePayload);

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
			data: responseData as UpdateDomainResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update domain', data),
		};
	}
}
