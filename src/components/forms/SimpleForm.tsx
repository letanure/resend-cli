import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
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
}

export const SimpleForm = ({ fields, onSubmit, onCancel }: SimpleFormProps) => {
	// Initialize form with empty values for all fields
	const [formData, setFormData] = useState<Record<string, string>>(() => {
		const initial: Record<string, string> = {};
		for (const field of fields) {
			initial[field.name] = '';
		}
		return initial;
	});

	// Track which field is currently focused for navigation
	const [currentField, setCurrentField] = useState(0);

	// Store validation errors to show user feedback
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Handle keyboard navigation and form submission
	useInput((_input, key) => {
		// Allow immediate exit without validation
		if (key.escape) {
			onCancel();
			return;
		}

		// Navigate to next field (wrapping disabled to prevent confusion)
		if (key.tab || key.downArrow) {
			const nextField = Math.min(currentField + 1, fields.length - 1);
			setCurrentField(nextField);
		}
		// Navigate to previous field (wrapping disabled to prevent confusion)
		else if (key.upArrow) {
			const prevField = Math.max(currentField - 1, 0);
			setCurrentField(prevField);
		}
		// Submit form with validation
		else if (key.return) {
			handleFormSubmission();
		}
	});

	// Validate all fields and return errors object
	const validateForm = (): Record<string, string> => {
		const validationErrors: Record<string, string> = {};

		for (const field of fields) {
			const value = formData[field.name]?.trim() || '';

			// Check required fields first (most common validation failure)
			if (field.required && !value) {
				validationErrors[field.name] = `${field.label} is required`;
				continue;
			}

			// Only validate format if field has content (empty optional fields are valid)
			if (value && field.type === 'email') {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) {
					validationErrors[field.name] = 'Invalid email address';
				}
			}
		}

		return validationErrors;
	};

	// Process form submission with validation
	const handleFormSubmission = () => {
		const validationErrors = validateForm();

		if (Object.keys(validationErrors).length === 0) {
			// Clean data by trimming whitespace before submission
			const cleanData: Record<string, string> = {};
			for (const [key, value] of Object.entries(formData)) {
				cleanData[key] = value.trim();
			}
			onSubmit(cleanData);
		} else {
			// Show validation errors to help user fix issues
			setErrors(validationErrors);
		}
	};

	// Update field value and clear any existing error for that field
	const handleFieldChange = (fieldName: string, value: string) => {
		// Update the field value
		setFormData((prev) => ({ ...prev, [fieldName]: value }));

		// Clear error immediately when user starts typing (better UX)
		if (errors[fieldName]) {
			setErrors((prev) => ({ ...prev, [fieldName]: '' }));
		}
	};

	return (
		<Box flexDirection="column">
			{/* Render all form fields */}
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

			{/* Show keyboard shortcuts for user guidance */}
			<Box marginTop={1} flexDirection="column">
				<Text dimColor={true}>
					<Text color="yellow">Tab/↓</Text> Next field · <Text color="yellow">↑</Text> Previous field
				</Text>
				<Text dimColor={true}>
					<Text color="yellow">Enter</Text> Submit · <Text color="yellow">Esc</Text> Cancel
				</Text>
			</Box>
		</Box>
	);
};
