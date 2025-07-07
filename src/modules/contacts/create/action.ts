import type { CreateContactResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateContactOptionsType } from './schema.js';

/**
 * Creates a contact using the Resend API
 *
 * @param contactData - Contact data including email, audience_id, and optional fields
 * @param apiKey - API key for Resend API (assumed to be valid)
 * @returns Promise<ApiResult<CreateContactResponseSuccess>> - Standard result format
 */
export async function createContact(
	contactData: CreateContactOptionsType,
	apiKey: string,
): Promise<ApiResult<CreateContactResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.contacts.create({
			email: contactData.email,
			audienceId: contactData.audience_id,
			firstName: contactData.first_name,
			lastName: contactData.last_name,
			unsubscribed: contactData.unsubscribed,
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create contact', contactData),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create contact', contactData),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create contact', contactData),
		};
	}
}
