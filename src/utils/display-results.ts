import type { ApiResult, CliField } from '@/types/index.js';
import { displayCLIResults } from '@/utils/cli.js';
import { logDryRunResults } from '@/utils/dry-run.js';
import type { OutputFormat } from '@/utils/output.js';

export interface OperationMessages {
	success: {
		title: string;
		message: (data: unknown) => string;
	};
	error: {
		title: string;
		message: string;
	};
	dryRun: {
		title: string;
		message: string;
	};
}

export interface DisplayResultsOptions<T> {
	data: T;
	result?: ApiResult<unknown>;
	fields: Array<CliField>;
	outputFormat: OutputFormat;
	apiKey?: string;
	operation: OperationMessages;
	isDryRun?: boolean;
}

/**
 * Generic function to display CLI operation results
 * Handles success, error, and dry-run scenarios consistently
 */
export function displayResults<T extends Record<string, unknown>>(options: DisplayResultsOptions<T>): void {
	const { data, result, fields, outputFormat, apiKey, operation, isDryRun = false } = options;

	// Handle dry-run mode
	if (isDryRun) {
		const metadata: Record<string, string> = {};
		if (apiKey) {
			metadata['API Key'] = `${apiKey.substring(0, 10)}...`;
		}
		metadata['Dry Run'] = 'true';

		if (outputFormat === 'json') {
			// For JSON output, still use displayCLIResults for consistency
			displayCLIResults(data, fields, outputFormat, operation.dryRun.title, metadata, operation.dryRun.message);
		} else {
			// For text output, use the specialized dry-run utility
			logDryRunResults(data, fields, operation.dryRun.title, metadata, operation.dryRun.message);
		}
		return;
	}

	// Handle actual operation results
	if (!result) {
		throw new Error('Result is required when not in dry-run mode');
	}

	if (result.success && result.data) {
		// Success case
		const successData = { ...data, ...result.data };
		const metadata: Record<string, string> = {};

		if (apiKey) {
			metadata['API Key'] = `${apiKey.substring(0, 10)}...`;
		}

		// Add operation-specific metadata
		if (result.data && typeof result.data === 'object' && 'id' in result.data) {
			metadata.ID = String(result.data.id);
		}

		displayCLIResults(
			successData,
			fields,
			outputFormat,
			operation.success.title,
			metadata,
			operation.success.message(result.data),
		);
	} else {
		// Error case
		const metadata: Record<string, string> = {};

		if (apiKey) {
			metadata['API Key'] = `${apiKey.substring(0, 10)}...`;
		}

		if (result.error) {
			metadata.Error = result.error;
		}

		displayCLIResults(data, fields, outputFormat, operation.error.title, metadata, operation.error.message);

		process.exit(1);
	}
}
