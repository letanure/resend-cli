import { Box, Text, useApp, useInput } from 'ink';
import type React from 'react';
import { useState } from 'react';
import { sendEmailAction } from './action.js';
import { SEND_EMAIL_SCHEMA, type SendEmailFormData, validateSendEmailData } from './validation.js';

interface SendEmailFormProps {
	onSubmit?: (data: SendEmailFormData) => void;
	onCancel?: () => void;
}

export const SendEmailForm: React.FC<SendEmailFormProps> = ({ onSubmit, onCancel }) => {
	const { exit } = useApp();
	const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
	const [formData, setFormData] = useState<Partial<SendEmailFormData>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitResult, setSubmitResult] = useState<{
		success: boolean;
		message?: string;
		error?: string;
	} | null>(null);

	const fields = Object.values(SEND_EMAIL_SCHEMA);
	const currentField = fields[currentFieldIndex];

	useInput(async (input, key) => {
		// Handle submission result state
		if (submitResult) {
			if (key.return || input === 'q') {
				if (onCancel) {
					onCancel();
				} else {
					exit();
				}
			}
			return;
		}

		// Handle form submission
		if (key.return && !key.shift) {
			// Try to submit the form
			await handleSubmit();
			return;
		}

		// Navigation
		if (key.upArrow && currentFieldIndex > 0) {
			setCurrentFieldIndex(currentFieldIndex - 1);
		}

		if (key.downArrow && currentFieldIndex < fields.length - 1) {
			setCurrentFieldIndex(currentFieldIndex + 1);
		}

		// Handle text input
		if (input && !key.ctrl && !key.meta && currentField) {
			const fieldKey = currentField.key;
			const currentValue = formData[fieldKey as keyof SendEmailFormData] || '';

			if (key.backspace || key.delete) {
				// Remove last character
				const newValue = typeof currentValue === 'string' ? currentValue.slice(0, -1) : '';
				setFormData((prev) => ({ ...prev, [fieldKey]: newValue }));
			} else {
				// Add character
				const newValue = typeof currentValue === 'string' ? currentValue + input : input;
				setFormData((prev) => ({ ...prev, [fieldKey]: newValue }));
			}
		}

		// Cancel
		if (input === 'q' || key.escape) {
			if (onCancel) {
				onCancel();
			} else {
				exit();
			}
		}
	});

	const handleSubmit = async () => {
		// Validate form
		const errors = validateSendEmailData(formData);
		if (errors.length > 0) {
			setSubmitResult({
				success: false,
				error: errors.join(', '),
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Validate required fields
			if (!formData.from || !formData.to || !formData.subject) {
				setSubmitResult({
					success: false,
					error: 'Missing required fields',
				});
				setIsSubmitting(false);
				return;
			}

			// Send email using the action
			const result = await sendEmailAction({
				from: formData.from,
				to: formData.to,
				subject: formData.subject,
				html: formData.html,
				text: formData.text,
				apiKey: formData.apiKey,
			});

			setSubmitResult({
				success: result.success,
				message: result.message,
				error: result.error,
			});

			// Call onSubmit callback if provided
			if (onSubmit && result.success) {
				onSubmit(formData as SendEmailFormData);
			}
		} catch (error) {
			setSubmitResult({
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show submission result
	if (submitResult) {
		return (
			<Box flexDirection="column" padding={1}>
				{submitResult.success && <Text color="green">{submitResult.message}</Text>}
				{submitResult.error && <Text color="red">{submitResult.error}</Text>}
				<Box marginTop={1}>
					<Text dimColor={true}>Press Enter or 'q' to exit</Text>
				</Box>
			</Box>
		);
	}

	if (isSubmitting) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text color="yellow">📤 Sending email...</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold={true} color="blue">
				📧 Send Email 2
			</Text>
			<Box marginBottom={1}>
				<Text dimColor={true}>Use ↑/↓ to navigate, Enter to submit, 'q' to cancel</Text>
			</Box>

			{fields.map((field, index) => {
				const isCurrentField = index === currentFieldIndex;
				const fieldKey = field.key;
				const value = formData[fieldKey as keyof SendEmailFormData] || '';
				const displayValue = Array.isArray(value) ? value.join(', ') : value;

				return (
					<Box key={fieldKey} marginBottom={1}>
						<Box width={20}>
							<Text color={isCurrentField ? 'cyan' : 'white'}>{field.tuiPrompt.label}:</Text>
						</Box>
						<Box flexGrow={1}>
							<Text color={isCurrentField ? 'green' : 'gray'} backgroundColor={isCurrentField ? 'black' : undefined}>
								{String(displayValue || field.tuiPrompt.placeholder)}
								{isCurrentField && '█'}
							</Text>
						</Box>
					</Box>
				);
			})}

			<Box marginTop={1}>
				<Text dimColor={true}>
					Current: {currentField?.tuiPrompt.label}
					{currentField?.required && <Text color="red"> (required)</Text>}
				</Text>
			</Box>
		</Box>
	);
};
