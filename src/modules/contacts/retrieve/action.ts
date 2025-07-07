import type { GetContactResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { RetrieveContactOptionsType } from './schema.js';

/**
 * Retrieves a contact using the Resend API
 *
 * @param contactData - Contact data containing audience_id and either id or email
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<GetContactResponseSuccess>> - Standard result format
 */
export async function retrieveContact(
	contactData: RetrieveContactOptionsType,
	apiKey: string,
): Promise<ApiResult<GetContactResponseSuccess>> {
	try {
		if (!contactData.audience_id) {
			throw new Error('Audience ID is required');
		}

		const resend = new Resend(apiKey);
		const { data, error } = await resend.contacts.get({
			audienceId: contactData.audience_id,
			...(contactData.id && { id: contactData.id }),
			...(contactData.email && { email: contactData.email }),
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'retrieve contact', contactData),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'retrieve contact', contactData),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'retrieve contact', contactData),
		};
	}
}
