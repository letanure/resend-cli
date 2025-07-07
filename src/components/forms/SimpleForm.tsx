import { Alert } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import type { z } from 'zod';
import type { FormField } from '@/types/index.js';
import { RadioField } from './RadioField.js';
import { TextInput } from './TextInput.js';

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
	const [formData, setFormData] = useState<Record<string, unknown>>(() => {
		const initial: Record<string, unknown> = {};
		for (const field of fields) {
			if (field.type === 'radio' && field.options) {
				// Set default value to first option's value
				initial[field.name] = field.options[0]?.value || false;
			} else {
				initial[field.name] = '';
			}
		}
		return initial;
	});

	const [currentField, setCurrentField] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string>('');
	useInput((input, key) => {
		const currentFieldData = fields[currentField];
		const isRadioField = currentFieldData?.type === 'radio';

		const keyHandlers: Array<{ condition: () => boolean; action: () => void }> = [
			{ condition: () => key.escape, action: onCancel },
			{ condition: () => key.shift && key.tab, action: () => setCurrentField(Math.max(currentField - 1, 0)) },
			{
				condition: () => key.tab && !key.shift,
				action: () => setCurrentField(Math.min(currentField + 1, fields.length - 1)),
			},
			{ condition: () => key.downArrow, action: () => setCurrentField(Math.min(currentField + 1, fields.length - 1)) },
			{ condition: () => key.upArrow, action: () => setCurrentField(Math.max(currentField - 1, 0)) },
			{
				condition: () => (key.leftArrow || key.rightArrow) && isRadioField,
				action: () => currentFieldData && handleRadioToggle(currentFieldData),
			},
			{
				condition: () => input === ' ' && isRadioField,
				action: () => currentFieldData && handleRadioToggle(currentFieldData),
			},
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
			const cleanedData: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(formData)) {
				if (typeof value === 'string') {
					cleanedData[key] = value.trim() === '' ? undefined : value.trim();
				} else {
					cleanedData[key] = value;
				}
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
				const cleanData: Record<string, unknown> = {};
				for (const [key, value] of Object.entries(formData)) {
					if (typeof value === 'string') {
						cleanData[key] = value.trim();
					} else {
						cleanData[key] = value;
					}
				}
				onSubmit(cleanData as T);
			}
		} else {
			setErrors(validationErrors);
			setFormError(currentFormError);
		}
	};

	const handleFieldChange = (fieldName: string, value: unknown) => {
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

	const handleRadioToggle = (field: FormField) => {
		if (field.options && field.options.length > 1) {
			const currentValue = formData[field.name];
			const currentIndex = field.options.findIndex((option) => option.value === currentValue);
			const nextIndex = (currentIndex + 1) % field.options.length;
			const nextValue = field.options[nextIndex]?.value;
			handleFieldChange(field.name, nextValue);
		}
	};

	return (
		<Box flexDirection="column" marginTop={1}>
			{formError && (
				<Box marginBottom={1}>
					<Alert variant="error">{formError}</Alert>
				</Box>
			)}
			{fields.map((field, index) => {
				if (field.type === 'radio' && field.options) {
					return (
						<RadioField
							key={field.name}
							label={field.label}
							options={field.options}
							value={formData[field.name] as string | boolean}
							isActive={currentField === index}
							helpText={field.helpText}
							errorMessage={errors[field.name]}
							onToggle={() => handleRadioToggle(field)}
						/>
					);
				}

				return (
					<TextInput
						key={field.name}
						label={field.label}
						value={String(formData[field.name] || '')}
						onChange={(value) => handleFieldChange(field.name, value)}
						placeholder={field.placeholder}
						helpText={field.helpText}
						isFocused={currentField === index}
						error={errors[field.name]}
					/>
				);
			})}

			<Box marginTop={1} flexDirection="column">
				<Text dimColor={true}>
					<Text color="yellow">Tab/↓</Text> Next field · <Text color="yellow">Shift+Tab/↑</Text> Previous field
				</Text>
				<Text dimColor={true}>
					<Text color="yellow">←/→/Space</Text> Toggle radio · <Text color="yellow">Enter</Text> Submit ·{' '}
					<Text color="yellow">Esc</Text> Cancel
				</Text>
			</Box>
		</Box>
	);
};
