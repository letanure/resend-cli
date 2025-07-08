import { Resend } from 'resend';
import type { CreateApiKeyOptionsType } from './schema.js';

export async function createApiKey(
	data: CreateApiKeyOptionsType,
	apiKey: string,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
	try {
		const resend = new Resend(apiKey);

		const apiKeyData: { name: string; permission: 'full_access' | 'sending_access'; domain_id?: string } = {
			name: data.name,
			permission: data.permission,
		};

		// Only include domain_id if it's provided and permission is sending_access
		if (data.domain_id && data.permission === 'sending_access') {
			apiKeyData.domain_id = data.domain_id;
		}

		const response = await resend.apiKeys.create(apiKeyData);

		if (response.error) {
			return {
				success: false,
				error: response.error.message || 'Failed to create API key',
			};
		}

		return {
			success: true,
			data: response.data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
}
