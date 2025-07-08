import type { RemoveContactsResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteContactOptionsType } from './schema.js';

/**
 * Deletes a contact using the Resend API
 *
 * @param data - Contact data for deletion
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<RemoveContactsResponseSuccess>> - Standard result format
 */
export async function deleteContact(
	data: DeleteContactOptionsType,
	apiKey: string,
): Promise<ApiResult<RemoveContactsResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.contacts.remove(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete contact', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete contact', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete contact', data),
		};
	}
}
