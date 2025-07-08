import { Resend } from 'resend';
import type { ApiResult } from '@/types/index.js';
import { formatResendError } from '@/utils/resendErrors.js';
import type { CreateBroadcastData } from './schema.js';

// Types based on API documentation
interface BroadcastPayload {
	audienceId: string;
	from: string;
	subject: string;
	replyTo?: Array<string>;
	html?: string;
	text?: string;
	name?: string;
}

interface CreateBroadcastResponse {
	id: string;
}

/**
 * Creates a broadcast using the Resend API
 *
 * @param data - Broadcast data containing audienceId, from, subject, and content
 * @param apiKey - Required API key for Resend API
 * @returns Promise<ApiResult<CreateBroadcastResponse>> - Standard result format
 */
export async function createBroadcast(
	data: CreateBroadcastData,
	apiKey: string,
): Promise<ApiResult<CreateBroadcastResponse>> {
	try {
		const resend = new Resend(apiKey);

		// Prepare the broadcast payload according to Resend API format
		const broadcastPayload: BroadcastPayload = {
			audienceId: data.audienceId as string,
			from: data.from as string,
			subject: data.subject as string,
		};

		// Add optional parameters if provided
		if (data.replyTo !== undefined) {
			// Convert comma-separated string to array if needed
			if (typeof data.replyTo === 'string') {
				broadcastPayload.replyTo = data.replyTo.split(',').map((email) => email.trim());
			} else {
				broadcastPayload.replyTo = data.replyTo as Array<string>;
			}
		}
		if (data.html !== undefined) {
			broadcastPayload.html = data.html;
		}
		if (data.text !== undefined) {
			broadcastPayload.text = data.text;
		}
		if (data.name !== undefined) {
			broadcastPayload.name = data.name;
		}

		const { data: responseData, error } = await resend.broadcasts.create(
			broadcastPayload as unknown as Parameters<typeof resend.broadcasts.create>[0],
		);

		if (error) {
			return {
				success: false,
				error: formatResendError(error, 'create broadcast', data),
			};
		}

		if (!responseData) {
			return {
				success: false,
				error: formatResendError('No data returned from API', 'create broadcast', data),
			};
		}

		return {
			success: true,
			data: responseData as CreateBroadcastResponse,
		};
	} catch (error) {
		return {
			success: false,
			error: formatResendError(error, 'create broadcast', data),
		};
	}
}
