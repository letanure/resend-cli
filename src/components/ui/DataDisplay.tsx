import { Alert } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import type { FormField } from '@/types/index.js';
import { formatDataWithFields } from '@/utils/display-formatter.js';
import { Layout } from './layout.js';

export interface DataDisplayProps {
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
	/** Callback when user exits */
	onExit: () => void;
}

/**
 * Reusable component for displaying data in a consistent format across all modules.
 * Replaces the need for individual display components in each module.
 */
export const DataDisplay = ({
	data,
	successMessage,
	headerText,
	fields = [],
	fieldsToShow,
	onExit,
}: DataDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	// Format the data using the utility function
	const formattedFields = formatDataWithFields(data, fields, fieldsToShow);

	return (
		<Layout headerText={headerText} showNavigationInstructions={true} navigationContext="result">
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">{successMessage}</Alert>
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
								<Text color="gray">{field.value}</Text>
							</Box>
						))}
					</Box>
				)}

				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Box>
		</Layout>
	);
};
