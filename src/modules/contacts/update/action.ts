import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateContactData } from './schema.js';

interface UpdateContactPayload {
	id?: string;
	email?: string;
	audienceId: string;
	firstName?: string;
	lastName?: string;
	unsubscribed?: boolean;
}

interface UpdateContactResponse {
	object: string;
	id: string;
}

/**
 * Updates a contact using the Resend API
 *
 * @param data - Contact data containing audienceId, id/email, and update parameters
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<UpdateContactResponse>> - Standard result format
 */
export async function updateContact(
	data: UpdateContactData,
	apiKey: string,
): Promise<ApiResult<UpdateContactResponse>> {
	try {
		const resend = new Resend(apiKey);

		// Prepare the update payload according to Resend API format
		const updatePayload: UpdateContactPayload = {
			audienceId: data.audienceId,
		};

		// Add identifier (id or email)
		if (data.id !== undefined) {
			updatePayload.id = data.id;
		}
		if (data.email !== undefined) {
			updatePayload.email = data.email;
		}

		// Add optional parameters if provided
		if (data.firstName !== undefined) {
			updatePayload.firstName = data.firstName;
		}
		if (data.lastName !== undefined) {
			updatePayload.lastName = data.lastName;
		}
		if (data.unsubscribed !== undefined) {
			updatePayload.unsubscribed = data.unsubscribed;
		}

		const { data: responseData, error } = await resend.contacts.update(updatePayload);

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
			data: responseData as UpdateContactResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update contact', data),
		};
	}
}
