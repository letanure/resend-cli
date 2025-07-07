import type { ListContactsResponseSuccess } from 'resend';
import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { ListContactsOptionsType } from './schema.js';

/**
 * Lists contacts for a specific audience using the Resend API
 *
 * @param options - Contact list options including audience_id
 * @param apiKey - API key for Resend API (assumed to be valid)
 * @returns Promise<ApiResult<ListContactsResponseSuccess>> - Standard result format
 */
export async function listContacts(
	options: ListContactsOptionsType,
	apiKey: string,
): Promise<ApiResult<ListContactsResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.contacts.list({
			audienceId: options.audience_id,
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'list contacts', options),
			};
		}

		if (!data) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'list contacts', options),
			};
		}

		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'list contacts', options),
		};
	}
}
