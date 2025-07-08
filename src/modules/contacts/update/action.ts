import type { UpdateContactResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateContactData } from './schema.js';

/**
 * Updates a contact using the Resend API
 *
 * @param data - Contact data for update
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<UpdateContactResponseSuccess>> - Standard result format
 */
export async function updateContact(
	data: UpdateContactData,
	apiKey: string,
): Promise<ApiResult<UpdateContactResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.contacts.update(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'update contact', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'update contact', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update contact', data),
		};
	}
}
