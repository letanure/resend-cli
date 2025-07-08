import type { CreateContactResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateContactOptionsType } from './schema.js';

/**
 * Creates a contact using the Resend API
 *
 * @param data - Contact data for creation
 * @param apiKey - API key for Resend API
 * @returns Promise<ApiResult<CreateContactResponseSuccess>> - Standard result format
 */
export async function createContact(
	data: CreateContactOptionsType,
	apiKey: string,
): Promise<ApiResult<CreateContactResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data: responseData, error } = await resend.contacts.create(data);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create contact', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create contact', data),
			};
		}

		return {
			success: true,
			data: responseData,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create contact', data),
		};
	}
}
