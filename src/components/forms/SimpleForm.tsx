import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import type { z } from 'zod';
import { TextInput } from './TextInput.js';

export interface FormField {
	name: string;
	label: string;
	placeholder?: string;
	helpText?: string;
	required?: boolean;
	type?: 'text' | 'email' | 'textarea';
}

interface SimpleFormProps {
	fields: Array<FormField>;
	onSubmit: (data: Record<string, string>) => void;
	onCancel: () => void;
	validateWith?: z.ZodSchema<unknown>;
}

export const SimpleForm = ({ fields, onSubmit, onCancel, validateWith }: SimpleFormProps) => {
	const [formData, setFormData] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const field of fields) {
			initial[field.name] = '';
		}
		return initial;
	});

	const [currentField, setCurrentField] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	useInput((_input, key) => {
		const keyHandlers: Array<{ condition: () => boolean; action: () => void }> = [
			{ condition: () => key.escape, action: onCancel },
			{ condition: () => key.shift && key.tab, action: () => setCurrentField(Math.max(currentField - 1, 0)) },
			{
				condition: () => key.tab && !key.shift,
				action: () => setCurrentField(Math.min(currentField + 1, fields.length - 1)),
			},
			{ condition: () => key.downArrow, action: () => setCurrentField(Math.min(currentField + 1, fields.length - 1)) },
			{ condition: () => key.upArrow, action: () => setCurrentField(Math.max(currentField - 1, 0)) },
			{ condition: () => key.return, action: handleFormSubmission },
		];

		for (const handler of keyHandlers) {
			if (handler.condition()) {
				handler.action();
				break;
			}
		}
	});
	const handleFormSubmission = () => {
		const validationErrors: Record<string, string> = {};

		if (validateWith) {
			const cleanedData: Record<string, string | undefined> = {};
			for (const [key, value] of Object.entries(formData)) {
				cleanedData[key] = value.trim() === '' ? undefined : value.trim();
			}
			const result = validateWith.safeParse(cleanedData);
			if (!result.success) {
				result.error.issues.forEach((issue) => {
					const field = issue.path[0];
					if (typeof field === 'string') {
						validationErrors[field] = issue.message;
					}
				});
			}
		}

		if (Object.keys(validationErrors).length === 0) {
			const cleanData: Record<string, string> = {};
			for (const [key, value] of Object.entries(formData)) {
				cleanData[key] = value.trim();
			}
			onSubmit(cleanData);
		} else {
			setErrors(validationErrors);
		}
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		setFormData((prev) => ({ ...prev, [fieldName]: value }));

		// Clear error when user starts typing
		if (errors[fieldName]) {
			setErrors((prev) => ({ ...prev, [fieldName]: '' }));
		}
	};

	return (
		<Box flexDirection="column">
			{fields.map((field, index) => (
				<TextInput
					key={field.name}
					label={field.label}
					value={formData[field.name] || ''}
					onChange={(value) => handleFieldChange(field.name, value)}
					placeholder={field.placeholder}
					helpText={field.helpText}
					isFocused={currentField === index}
					error={errors[field.name]}
				/>
			))}

			<Box marginTop={1} flexDirection="column">
				<Text dimColor={true}>
					<Text color="yellow">Tab/↓</Text> Next field · <Text color="yellow">Shift+Tab/↑</Text> Previous field
				</Text>
				<Text dimColor={true}>
					<Text color="yellow">Enter</Text> Submit · <Text color="yellow">Esc</Text> Cancel
				</Text>
			</Box>
		</Box>
	);
};
