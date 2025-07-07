// Output formatting utilities for CLI commands

export type OutputFormat = 'text' | 'json';

export interface JsonSuccessResponse<T = unknown> {
	success: true;
	data: T;
}

export interface JsonErrorResponse {
	success: false;
	error: string;
	code?: string;
	errors?: Array<{ field: string; message: string }>;
}

export type JsonResponse<T = unknown> = JsonSuccessResponse<T> | JsonErrorResponse;

// Output success result
export function outputSuccess<T>(data: T, format: OutputFormat, textCallback: () => void): void {
	if (format === 'json') {
		const response: JsonSuccessResponse<T> = {
			success: true,
			data,
		};
		console.log(JSON.stringify(response, null, 2));
	} else {
		textCallback();
	}
}

// Output validation errors
export function outputValidationErrors(
	errors: Array<{ path: string | number; message: string }>,
	format: OutputFormat,
	textCallback: () => void,
): void {
	if (format === 'json') {
		const response: JsonErrorResponse = {
			success: false,
			error: 'We found an error with one or more fields in the request.',
			code: 'validation_error',
			errors: errors.map((err) => ({
				field: String(err.path),
				message: err.message,
			})),
		};
		console.log(JSON.stringify(response, null, 2));
	} else {
		textCallback();
	}
}

// Output general error
export function outputError(message: string, format: OutputFormat, textCallback: () => void): void {
	if (format === 'json') {
		const response: JsonErrorResponse = {
			success: false,
			error: message,
		};
		console.log(JSON.stringify(response, null, 2));
	} else {
		textCallback();
	}
}
