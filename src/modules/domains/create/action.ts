import type { CreateDomainResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateDomainData } from './schema.js';

/**
 * Creates a domain using the Resend API
 *
 * @param data - Domain data containing name, region, and custom_return_path
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<CreateDomainResponseSuccess>> - Standard result format
 */
export async function createDomain(
	data: CreateDomainData,
	apiKey: string,
): Promise<ApiResult<CreateDomainResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.domains.create({
			name: data.name,
			region: data.region || 'us-east-1',
			customReturnPath: data.custom_return_path || 'send',
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create domain', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create domain', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create domain', data),
		};
	}
}
