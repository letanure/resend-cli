import { Alert } from '@inkjs/ui';
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

interface SimpleFormProps<T = Record<string, unknown>> {
	fields: Array<FormField>;
	onSubmit: (data: T) => void;
	onCancel: () => void;
	validateWith?: z.ZodType<T, z.ZodTypeDef, unknown>;
}

export const SimpleForm = <T = Record<string, unknown>>({
	fields,
	onSubmit,
	onCancel,
	validateWith,
}: SimpleFormProps<T>) => {
	const [formData, setFormData] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const field of fields) {
			initial[field.name] = '';
		}
		return initial;
	});

	const [currentField, setCurrentField] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string>('');
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
		let validatedData: unknown = null;
		let currentFormError = '';

		if (validateWith) {
			const cleanedData: Record<string, string | undefined> = {};
			for (const [key, value] of Object.entries(formData)) {
				cleanedData[key] = value.trim() === '' ? undefined : value.trim();
			}
			const result = validateWith.safeParse(cleanedData);
			if (result.success) {
				validatedData = result.data;
			} else {
				result.error.issues.forEach((issue) => {
					const field = issue.path[0];
					if (typeof field === 'string') {
						validationErrors[field] = issue.message;
					} else {
						// Form-level error (no specific field)
						currentFormError = issue.message;
					}
				});
			}
		}

		if (Object.keys(validationErrors).length === 0 && !currentFormError) {
			setFormError('');
			if (validatedData) {
				// Pass validated, transformed data from schema
				onSubmit(validatedData as T);
			} else {
				// Fallback to cleaned raw data if no schema
				const cleanData: Record<string, string> = {};
				for (const [key, value] of Object.entries(formData)) {
					cleanData[key] = value.trim();
				}
				onSubmit(cleanData as T);
			}
		} else {
			setErrors(validationErrors);
			setFormError(currentFormError);
		}
	};

	const handleFieldChange = (fieldName: string, value: string) => {
		setFormData((prev) => ({ ...prev, [fieldName]: value }));

		// Clear error when user starts typing
		if (errors[fieldName]) {
			setErrors((prev) => ({ ...prev, [fieldName]: '' }));
		}

		// Clear form-level error when user starts typing
		if (formError) {
			setFormError('');
		}
	};

	return (
		<Box flexDirection="column" marginTop={1}>
			{formError && (
				<Box marginBottom={1}>
					<Alert variant="error">{formError}</Alert>
				</Box>
			)}
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
