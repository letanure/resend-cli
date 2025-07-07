import type { RemoveContactsResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { DeleteContactOptionsType } from './schema.js';

/**
 * Deletes a contact using the Resend API
 *
 * @param contactData - Contact data containing audience_id and either id or email
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<RemoveContactsResponseSuccess>> - Standard result format
 */
export async function deleteContact(
	contactData: DeleteContactOptionsType,
	apiKey: string,
): Promise<ApiResult<RemoveContactsResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.contacts.remove({
			audienceId: contactData.audience_id,
			id: contactData.id,
			email: contactData.email,
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'delete contact', contactData),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'delete contact', contactData),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'delete contact', contactData),
		};
	}
}
