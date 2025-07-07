/**
 * Shared utility for Resend API key validation
 * Used by both CLI commands and TUI components
 */

const RESEND_API_KEY_DOCS_URL = 'https://resend.com/docs/dashboard/api-keys/introduction';

/**
 * Gets and validates the Resend API key from environment variables
 * Exits the process if the API key is missing (for CLI usage)
 */
export function getResendApiKey(): string {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		console.error('Missing RESEND_API_KEY environment variable.');
		console.error(`Get your API key at ${RESEND_API_KEY_DOCS_URL}`);
		process.exit(1);
	}

	return apiKey;
}

/**
 * Checks if the Resend API key is available
 * Returns the key if available, null if missing (for TUI usage)
 */
export function getResendApiKeyOrNull(): string | null {
	return process.env.RESEND_API_KEY || null;
}

/**
 * Gets the documentation URL for Resend API keys
 */
export function getResendApiKeyDocsUrl(): string {
	return RESEND_API_KEY_DOCS_URL;
}
