import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { UpdateEmailOptionsType } from './schema.js';

/**
 * Updates a scheduled email using the Resend API
 *
 * @param updateData - Update data containing email ID and new scheduled_at
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<{ id: string; object: string }>> - Standard result format
 */
export async function updateEmail(
	updateData: UpdateEmailOptionsType,
	apiKey: string,
): Promise<ApiResult<{ id: string; object: string }>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.emails.update({
			id: updateData.id,
			scheduledAt: updateData.scheduled_at,
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'update email', updateData),
			};
		}

		return {
			success: true,
			data: data || { id: updateData.id, object: 'email' },
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'update email', updateData),
		};
	}
}
