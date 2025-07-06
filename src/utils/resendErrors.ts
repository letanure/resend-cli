import type { ErrorResponse } from 'resend';

/**
 * Resend API error types and handling
 * Based on official Resend documentation
 */

/**
 * Resend's official error types plus our custom fallback
 */
export type ResendErrorType = ErrorResponse['name'] | 'unknown_error';

export interface ResendErrorInfo {
	status: number;
	type: ResendErrorType;
	message: string;
	suggestion: string;
}

export const RESEND_ERROR_CODES: Record<ResendErrorType, ResendErrorInfo> = {
	missing_required_field: {
		status: 422,
		type: 'missing_required_field',
		message: 'The request body is missing one or more required fields.',
		suggestion: 'Check the error details to see the list of missing fields.',
	},
	invalid_idempotency_key: {
		status: 400,
		type: 'invalid_idempotency_key',
		message: 'The key must be between 1-256 chars.',
		suggestion: 'Retry with a valid idempotency key.',
	},
	invalid_idempotent_request: {
		status: 409,
		type: 'invalid_idempotent_request',
		message: 'Same idempotency key used with a different request payload.',
		suggestion: 'Change your idempotency key or payload.',
	},
	concurrent_idempotent_requests: {
		status: 409,
		type: 'concurrent_idempotent_requests',
		message: 'Same idempotency key used while original request is still in progress.',
		suggestion: 'Try the request again later.',
	},
	invalid_access: {
		status: 422,
		type: 'invalid_access',
		message: 'Access must be "full_access" | "sending_access".',
		suggestion: 'Make sure the API key has necessary permissions.',
	},
	invalid_parameter: {
		status: 422,
		type: 'invalid_parameter',
		message: 'The parameter must be a valid UUID.',
		suggestion: "Check the value and make sure it's valid.",
	},
	invalid_region: {
		status: 422,
		type: 'invalid_region',
		message: 'Region must be "us-east-1" | "eu-west-1" | "sa-east-1".',
		suggestion: 'Make sure the correct region is selected.',
	},
	rate_limit_exceeded: {
		status: 429,
		type: 'rate_limit_exceeded',
		message: 'Too many requests. Please limit the number of requests per second.',
		suggestion: 'Reduce the rate at which you request the API or contact support to increase rate limit.',
	},
	missing_api_key: {
		status: 401,
		type: 'missing_api_key',
		message: 'Missing API key in the authorization header.',
		suggestion: 'Include the following header in the request: Authorization: Bearer YOUR_API_KEY.',
	},
	invalid_api_Key: {
		status: 403,
		type: 'invalid_api_Key',
		message: 'API key is invalid.',
		suggestion: 'Make sure the API key is correct or generate a new API key in the Resend dashboard.',
	},
	invalid_from_address: {
		status: 403,
		type: 'invalid_from_address',
		message: 'Invalid from field.',
		suggestion: 'Make sure the from field follows the email@example.com or Name <email@example.com> format.',
	},
	validation_error: {
		status: 403,
		type: 'validation_error',
		message: 'We found an error with one or more fields in the request.',
		suggestion: 'The message will contain more details about what field and error were found.',
	},
	not_found: {
		status: 404,
		type: 'not_found',
		message: 'The requested endpoint does not exist.',
		suggestion: 'Check your request URL to match a valid API endpoint.',
	},
	method_not_allowed: {
		status: 405,
		type: 'method_not_allowed',
		message: 'Method is not allowed for the requested path.',
		suggestion: 'Change your API endpoint to use a valid method.',
	},
	application_error: {
		status: 500,
		type: 'application_error',
		message: 'An unexpected error occurred.',
		suggestion: "Try the request again later. If the error persists, check Resend's status page.",
	},
	internal_server_error: {
		status: 500,
		type: 'internal_server_error',
		message: 'An unexpected error occurred.',
		suggestion: "Try the request again later. If the error persists, check Resend's status page.",
	},
	unknown_error: {
		status: 0,
		type: 'unknown_error',
		message: 'An unknown error occurred.',
		suggestion: 'Please try again or contact support if the issue persists.',
	},
};

/**
 * Formats a user-friendly error message from Resend error response
 */
export function formatResendError(error: ErrorResponse | unknown, action: string, requestData?: unknown): string {
	if (error && typeof error === 'object' && 'name' in error && 'message' in error) {
		const resendError = error as ErrorResponse;
		const errorInfo = RESEND_ERROR_CODES[resendError.name as ResendErrorType] || RESEND_ERROR_CODES.unknown_error;

		let result = `Failed to ${action}\n\n${resendError.message}\n\nSuggestion: ${errorInfo.suggestion}`;

		if (requestData) {
			result += `\n\nRequest data:\n${JSON.stringify(requestData, null, 2)}`;
		}

		result += `\n\nRequest response, with HTTP Code: ${errorInfo.status}\n${JSON.stringify(error, null, 2)}`;

		return result;
	}

	// Fallback for non-Resend errors
	const errorObj = error as Record<string, unknown>;
	const errorType = errorObj?.name || errorObj?.type || 'unknown_error';
	const errorInfo = RESEND_ERROR_CODES[errorType as ResendErrorType] || RESEND_ERROR_CODES.unknown_error;

	// Use error message if available, or custom
	const message = (errorObj?.message as string) || errorInfo.message;
	const httpStatus = (errorObj?.statusCode as number) || (errorObj?.status as number) || errorInfo.status || 'Unknown';

	let result = `Failed to ${action}\n\n${message}\n\nSuggestion: ${errorInfo.suggestion}`;

	// Always show debug data
	if (requestData) {
		result += `\n\nRequest data:\n${JSON.stringify(requestData, null, 2)}`;
	}

	result += `\n\nRequest response, with HTTP Code: ${httpStatus}\n${JSON.stringify(error, null, 2)}`;

	return result;
}
