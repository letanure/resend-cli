import { Box, Text } from 'ink';
import { formatDataWithFields } from '@/utils/display-formatter.js';
import { commonEmailFields } from './fields.js';

interface EmailDisplayProps {
	data: Record<string, unknown>;
	title?: string;
	fieldsToShow?: Array<string>;
}

export const EmailDisplay = ({ data, title = 'Email Details', fieldsToShow }: EmailDisplayProps) => {
	// Use shared formatting logic
	const formattedFields = formatDataWithFields(data, commonEmailFields, fieldsToShow);

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold={true}>{title}</Text>
			</Box>

			{formattedFields.map((field) => (
				<Box key={field.label}>
					<Text bold={true}>{field.label.padEnd(15)}: </Text>
					<Text>{field.value}</Text>
				</Box>
			))}
		</Box>
	);
};
