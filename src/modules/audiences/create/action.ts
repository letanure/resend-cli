import { Resend } from 'resend';
import type { CreateAudienceResponseSuccess } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateAudienceOptionsType } from './schema.js';

/**
 * Creates an audience using the Resend API
 *
 * @param audienceData - Audience data containing name
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<CreateAudienceResponseSuccess>> - Standard result format
 */
export async function createAudience(
	audienceData: CreateAudienceOptionsType,
	apiKey: string,
): Promise<ApiResult<CreateAudienceResponseSuccess>> {
	try {
		const resend = new Resend(apiKey);
		const { data, error } = await resend.audiences.create({
			name: audienceData.name,
		});

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create audience', audienceData),
			};
		}

		return {
			success: true,
			data: {
				id: data?.id || 'unknown',
				object: 'audience' as const,
				name: data?.name || audienceData.name,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create audience', audienceData),
		};
	}
}
