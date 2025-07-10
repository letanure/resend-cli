import { Alert } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import type { FormField } from '@/types/index.js';
import { formatDataWithFields } from '@/utils/display-formatter.js';
import { Layout } from './layout.js';

export interface SuccessScreenProps {
	/** The data object to display */
	data: Record<string, unknown>;
	/** Success message to show in alert */
	successMessage: string;
	/** Header text for the layout */
	headerText: string;
	/** Field definitions for proper labeling and formatting */
	fields?: Array<FormField>;
	/** Specific fields to show (if not provided, shows all non-empty fields) */
	fieldsToShow?: Array<string>;
	/** Whether this is a dry run (shows warning instead of success) */
	isDryRun?: boolean;
	/** Callback when user exits */
	onExit: () => void;
}

/**
 * Reusable component for displaying success data in a consistent format across all modules.
 * Handles both regular success displays and dry run displays with appropriate warnings.
 * Replaces the need for individual success/dry run display components in each module.
 */
export const SuccessScreen = ({
	data,
	successMessage,
	headerText,
	fields = [],
	fieldsToShow,
	isDryRun = false,
	onExit,
}: SuccessScreenProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	// Format the data using the utility function
	const formattedFields = formatDataWithFields(data, fields, fieldsToShow);

	// Determine alert variant and message based on dry run mode
	const alertVariant = isDryRun ? 'warning' : 'success';
	const displayMessage = isDryRun ? `DRY RUN - ${successMessage} (validation only)` : successMessage;

	return (
		<Layout headerText={headerText} showNavigationInstructions={true} navigationContext="result">
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant={alertVariant}>{displayMessage}</Alert>
				</Box>

				{formattedFields.length > 0 && (
					<Box flexDirection="column">
						{formattedFields.map((field) => (
							<Box key={field.label}>
								<Box width={20}>
									<Text bold={true} color="cyan">
										{field.label}:
									</Text>
								</Box>
								<Text>{field.value}</Text>
							</Box>
						))}
					</Box>
				)}
			</Box>
		</Layout>
	);
};
