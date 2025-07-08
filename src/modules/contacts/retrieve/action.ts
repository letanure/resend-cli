import type { GetContactResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveContactOptionsType } from './schema.js';

/**
 * Retrieves a contact using the Resend API
 *
 * @param data - Contact data for retrieval
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<GetContactResponseSuccess>> - Standard result format
 */
export async function retrieveContact(
	data: RetrieveContactOptionsType,
	apiKey: string,
): Promise<ApiResult<GetContactResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.contacts.get(data as never);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'retrieve contact', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'retrieve contact', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve contact', data),
		};
	}
}
