import type { ListContactsResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { ListContactsOptionsType } from './schema.js';

/**
 * Lists contacts for a specific audience using the Resend API
 *
 * @param data - Contact list data
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<ListContactsResponseSuccess>> - Standard result format
 */
export async function listContacts(
	data: ListContactsOptionsType,
	apiKey: string,
): Promise<ApiResult<ListContactsResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.contacts.list(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list contacts', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list contacts', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list contacts', data),
		};
	}
}
