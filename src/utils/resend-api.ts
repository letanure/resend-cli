/**
 * Shared utility for Resend API key validation
 * Used by both CLI commands and TUI components
 */

const RESEND_API_KEY_DOCS_URL = 'https://resend.com/docs/dashboard/api-keys/introduction';

/**
 * Gets and validates the Resend API key from environment variables or command line
 * Exits the process if the API key is missing (for CLI usage)
 */
export function getResendApiKey(providedApiKey?: string): string {
	// Priority order: 1) Environment variable, 2) Command line parameter
	const apiKey = process.env.RESEND_API_KEY || providedApiKey;

	if (!apiKey) {
		console.error('Missing RESEND_API_KEY environment variable or --api-key option.');
		console.error(`Get your API key at ${RESEND_API_KEY_DOCS_URL}`);
		process.exit(1);
	}

	return apiKey;
}

/**
 * Checks if the Resend API key is available
 * Returns the key if available, null if missing (for TUI usage)
 */
export function getResendApiKeyOrNull(providedApiKey?: string): string | null {
	// Priority order: 1) Environment variable, 2) Command line parameter
	return process.env.RESEND_API_KEY || providedApiKey || null;
}

/**
 * Gets the documentation URL for Resend API keys
 */
export function getResendApiKeyDocsUrl(): string {
	return RESEND_API_KEY_DOCS_URL;
}
