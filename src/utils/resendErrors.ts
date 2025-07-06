/**
 * Resend API error types and handling
 * Based on official Resend documentation
 */

export type ResendErrorType =
	| 'invalid_idempotency_key'
	| 'validation_error'
	| 'missing_api_key'
	| 'restricted_api_key'
	| 'invalid_api_key'
	| 'not_found'
	| 'method_not_allowed'
	| 'invalid_idempotent_request'
	| 'concurrent_idempotent_requests'
	| 'invalid_attachment'
	| 'invalid_from_address'
	| 'invalid_access'
	| 'invalid_parameter'
	| 'invalid_region'
	| 'missing_required_field'
	| 'daily_quota_exceeded'
	| 'rate_limit_exceeded'
	| 'security_error'
	| 'application_error'
	| 'internal_server_error'
	| 'unknown_error';

export interface ResendErrorInfo {
	status: number;
	type: ResendErrorType;
	message: string;
	suggestion: string;
}

export const RESEND_ERROR_CODES: Record<ResendErrorType, ResendErrorInfo> = {
	invalid_idempotency_key: {
		status: 400,
		type: 'invalid_idempotency_key',
		message: 'The key must be between 1-256 chars.',
		suggestion: 'Retry with a valid idempotency key.',
	},
	validation_error: {
		status: 400,
		type: 'validation_error',
		message: 'We found an error with one or more fields in the request.',
		suggestion: 'The message will contain more details about what field and error were found.',
	},
	missing_api_key: {
		status: 401,
		type: 'missing_api_key',
		message: 'Missing API key in the authorization header.',
		suggestion: 'Include the following header in the request: Authorization: Bearer YOUR_API_KEY.',
	},
	restricted_api_key: {
		status: 401,
		type: 'restricted_api_key',
		message: 'This API key is restricted to only send emails.',
		suggestion: 'Make sure the API key has Full access to perform actions other than sending emails.',
	},
	invalid_api_key: {
		status: 403,
		type: 'invalid_api_key',
		message: 'API key is invalid.',
		suggestion: 'Make sure the API key is correct or generate a new API key in the Resend dashboard.',
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
	invalid_attachment: {
		status: 422,
		type: 'invalid_attachment',
		message: 'Attachment must have either a content or path.',
		suggestion: 'Attachments must either have content (strings, Buffer, or Stream) or path to a remote resource.',
	},
	invalid_from_address: {
		status: 422,
		type: 'invalid_from_address',
		message: 'Invalid from field.',
		suggestion: 'Make sure the from field follows the email@example.com or Name <email@example.com> format.',
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
	missing_required_field: {
		status: 422,
		type: 'missing_required_field',
		message: 'The request body is missing one or more required fields.',
		suggestion: 'Check the error details to see the list of missing fields.',
	},
	daily_quota_exceeded: {
		status: 429,
		type: 'daily_quota_exceeded',
		message: 'You have reached your daily email sending quota.',
		suggestion:
			'Upgrade your plan to remove the daily quota limit or wait until 24 hours have passed to continue sending.',
	},
	rate_limit_exceeded: {
		status: 429,
		type: 'rate_limit_exceeded',
		message: 'Too many requests. Please limit the number of requests per second.',
		suggestion: 'Reduce the rate at which you request the API or contact support to increase rate limit.',
	},
	security_error: {
		status: 451,
		type: 'security_error',
		message: 'We may have found a security issue with the request.',
		suggestion: 'Contact support for more information about this security issue.',
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
export function formatResendError(error: unknown, action: string, requestData?: unknown): string {
	// Try to extract error type from Resend response
	const errorObj = error as Record<string, unknown>;
	const errorType = errorObj?.name || errorObj?.type || 'unknown_error';
	const errorInfo = RESEND_ERROR_CODES[errorType as ResendErrorType] || RESEND_ERROR_CODES.unknown_error;

	// Use actual error message if available, otherwise use our mapped message
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
