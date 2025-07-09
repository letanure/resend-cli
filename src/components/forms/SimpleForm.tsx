import { Alert } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import type { z } from 'zod';
import type { FormField } from '@/types/index.js';
import { SelectField } from './SelectField.js';
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
			if (field.type === 'select' && field.options) {
				// Set default value to first option's value
				initial[field.name] = field.options[0]?.value || false;
			} else {
				initial[field.name] = '';
			}
		}
		return initial;
	});

	const [currentField, setCurrentField] = useState(0);
	const [_currentSelectOption, setCurrentSelectOption] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string>('');
	useInput((input, key) => {
		const currentFieldData = fields[currentField];
		const isSelectField = currentFieldData?.type === 'select';
		const isStackedSelect = isSelectField && currentFieldData?.display === 'stacked';

		const keyHandlers: Array<{ condition: () => boolean; action: () => void }> = [
			{ condition: () => key.escape, action: onCancel },
			{ condition: () => key.shift && key.tab, action: () => setCurrentField(Math.max(currentField - 1, 0)) },
			{
				condition: () => key.tab && !key.shift,
				action: () => setCurrentField(Math.min(currentField + 1, fields.length - 1)),
			},
			// Special handling for stacked select fields
			{
				condition: () => key.downArrow && isStackedSelect,
				action: () => handleStackedSelectNavigation('down'),
			},
			{
				condition: () => key.upArrow && isStackedSelect,
				action: () => handleStackedSelectNavigation('up'),
			},
			// Default field navigation for non-stacked selects
			{
				condition: () => key.downArrow && !isStackedSelect,
				action: () => setCurrentField(Math.min(currentField + 1, fields.length - 1)),
			},
			{
				condition: () => key.upArrow && !isStackedSelect,
				action: () => setCurrentField(Math.max(currentField - 1, 0)),
			},
			{
				condition: () => (key.leftArrow || key.rightArrow) && isSelectField,
				action: () => currentFieldData && handleSelectToggle(currentFieldData),
			},
			{
				condition: () => input === ' ' && isSelectField,
				action: () => currentFieldData && handleSelectToggle(currentFieldData),
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

	const handleSelectToggle = (field: FormField) => {
		if (field.options && field.options.length > 1) {
			const currentValue = formData[field.name];
			const currentIndex = field.options.findIndex((option) => option.value === currentValue);
			const nextIndex = (currentIndex + 1) % field.options.length;
			const nextValue = field.options[nextIndex]?.value;
			handleFieldChange(field.name, nextValue);
			setCurrentSelectOption(nextIndex);
		}
	};

	const handleStackedSelectNavigation = (direction: 'up' | 'down') => {
		const currentFieldData = fields[currentField];
		if (!currentFieldData?.options) {
			return;
		}

		const currentValue = formData[currentFieldData.name];
		const currentIndex = currentFieldData.options.findIndex((option) => option.value === currentValue);
		const optionsLength = currentFieldData.options.length;

		if (direction === 'down') {
			if (currentIndex < optionsLength - 1) {
				// Move to next option
				const nextIndex = currentIndex + 1;
				const nextValue = currentFieldData.options[nextIndex]?.value;
				handleFieldChange(currentFieldData.name, nextValue);
				setCurrentSelectOption(nextIndex);
			} else {
				// Move to next field when on last option
				setCurrentField(Math.min(currentField + 1, fields.length - 1));
			}
		} else if (direction === 'up') {
			if (currentIndex > 0) {
				// Move to previous option
				const prevIndex = currentIndex - 1;
				const prevValue = currentFieldData.options[prevIndex]?.value;
				handleFieldChange(currentFieldData.name, prevValue);
				setCurrentSelectOption(prevIndex);
			} else {
				// Move to previous field when on first option
				setCurrentField(Math.max(currentField - 1, 0));
			}
		}
	};

	return (
		<Box flexDirection="column" marginTop={1}>
			{fields.map((field, index) => {
				if (field.type === 'select' && field.options) {
					return (
						<SelectField
							key={field.name}
							label={field.label}
							options={field.options}
							value={formData[field.name] as string | boolean}
							isActive={currentField === index}
							helpText={field.helpText}
							errorMessage={errors[field.name]}
							display={field.display}
							onToggle={() => handleSelectToggle(field)}
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

			{formError && (
				<Box marginTop={1}>
					<Alert variant="error">{formError}</Alert>
				</Box>
			)}

			<Box marginTop={1} flexDirection="column">
				<Text dimColor={true}>
					<Text color="yellow">Tab/↓</Text> Next field · <Text color="yellow">Shift+Tab/↑</Text> Previous field
				</Text>
				<Text dimColor={true}>
					<Text color="yellow">←/→/Space</Text> Toggle select · <Text color="yellow">Enter</Text> Submit ·{' '}
					<Text color="yellow">Esc</Text> Cancel
				</Text>
			</Box>
		</Box>
	);
};
