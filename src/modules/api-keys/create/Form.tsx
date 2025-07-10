import { Alert } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import { useState } from 'react';
import { SelectField } from '@/components/forms/SelectField.js';
import { TextInput } from '@/components/forms/TextInput.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { createApiKey } from './action.js';
import { displayFields, fields } from './fields.js';
import { CreateApiKeyOptionsSchema, type CreateApiKeyOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [formData, setFormData] = useState<Record<string, unknown>>({
		name: '',
		permission: 'full_access',
		domain_id: '',
	});

	const [currentField, setCurrentField] = useState(0);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string>('');
	const [successData, setSuccessData] = useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = useState(false);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	const visibleFields = fields;

	// Find next/previous non-disabled field
	const findNextField = (start: number, direction: 1 | -1): number => {
		let index = start;
		const max = visibleFields.length - 1;

		do {
			index += direction;
			if (index < 0) {
				index = max;
			}
			if (index > max) {
				index = 0;
			}

			const field = visibleFields[index];
			const isDisabled = field?.name === 'domain_id' && formData.permission === 'full_access';
			if (!isDisabled) {
				return index;
			}
		} while (index !== start);

		return start;
	};

	// Handle Esc/Left arrow key to go back from result screens
	useInput(
		(_input, key) => {
			if ((key.escape || key.leftArrow) && (successData || error)) {
				setSuccessData(null);
				setIsDryRunSuccess(false);
				setError(null);
			}
		},
		{ isActive: !!(successData || error) },
	);

	useInput((input, key) => {
		if (successData || error) {
			return; // Don't handle input when showing result
		}

		const currentFieldData = visibleFields[currentField];
		const isSelectField = currentFieldData?.type === 'select';

		const keyHandlers: Array<{ condition: () => boolean; action: () => void }> = [
			{ condition: () => key.escape, action: onExit },
			// Left arrow to exit form - only if NOT on a select field
			{ condition: () => key.leftArrow && !isSelectField, action: onExit },
			{ condition: () => key.shift && key.tab, action: () => setCurrentField(findNextField(currentField, -1)) },
			{
				condition: () => key.tab && !key.shift,
				action: () => setCurrentField(findNextField(currentField, 1)),
			},
			{
				condition: () => key.downArrow,
				action: () => setCurrentField(findNextField(currentField, 1)),
			},
			{ condition: () => key.upArrow, action: () => setCurrentField(findNextField(currentField, -1)) },
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

	const handleFormSubmission = async () => {
		const validationErrors: Record<string, string> = {};
		let validatedData: unknown = null;
		let currentFormError = '';

		const cleanedData: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(formData)) {
			if (typeof value === 'string') {
				cleanedData[key] = value.trim() === '' ? undefined : value.trim();
			} else {
				cleanedData[key] = value;
			}
		}

		const result = CreateApiKeyOptionsSchema.safeParse(cleanedData);
		if (result.success) {
			validatedData = result.data;
		} else {
			result.error.issues.forEach((issue) => {
				const field = issue.path[0];
				if (typeof field === 'string') {
					validationErrors[field] = issue.message;
				} else {
					currentFormError = issue.message;
				}
			});
		}

		if (Object.keys(validationErrors).length === 0 && !currentFormError) {
			setFormError('');
			if (validatedData) {
				try {
					if (isDryRun) {
						setSuccessData({
							id: 'dry-run-api-key-id',
							token: 'dry-run-token-re_xxxxx',
						});
						setIsDryRunSuccess(true);
					} else {
						const apiResult = await createApiKey(validatedData as CreateApiKeyOptionsType, apiKey);
						if (apiResult.success && apiResult.data) {
							setSuccessData(apiResult.data as unknown as Record<string, unknown>);
							setIsDryRunSuccess(false);
						} else {
							setError({
								title: 'API Key Creation Failed',
								message: apiResult.error || 'Unknown error occurred',
								suggestion: 'Check your API key and permissions',
							});
						}
					}
				} catch (err) {
					setError({
						title: 'API Key Creation Error',
						message: err instanceof Error ? err.message : 'Unknown error',
						suggestion: 'Please check your API key and network connection',
					});
				}
			}
		} else {
			setErrors(validationErrors);
			setFormError(currentFormError);
		}
	};

	const handleFieldChange = (fieldName: string, value: unknown) => {
		setFormData((prev) => {
			const newData = { ...prev, [fieldName]: value };

			// Clear domain_id when switching to full_access
			if (fieldName === 'permission' && value === 'full_access') {
				newData.domain_id = '';
			}

			return newData;
		});

		// Clear error when user starts typing
		if (errors[fieldName]) {
			setErrors((prev) => ({ ...prev, [fieldName]: '' }));
		}

		// Clear form-level error when user starts typing
		if (formError) {
			setFormError('');
		}

		// When permission changes, check if we need to move focus away from disabled field
		if (fieldName === 'permission') {
			const currentFieldData = visibleFields[currentField];
			if (currentFieldData?.name === 'domain_id' && value === 'full_access') {
				// Move to first non-disabled field
				setCurrentField(findNextField(currentField, 1));
			}
		}
	};

	const handleSelectToggle = (field: { name: string; options?: Array<{ value: string | boolean }> }) => {
		if (field.options && field.options.length > 1) {
			const currentValue = formData[field.name];
			const currentIndex = field.options.findIndex((option) => option.value === currentValue);
			const nextIndex = (currentIndex + 1) % field.options.length;
			const nextValue = field.options[nextIndex]?.value;
			handleFieldChange(field.name, nextValue);
		}
	};

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="API Key Created Successfully"
				headerText={`${config.baseTitle} - API Keys - Create`}
				fields={displayFields}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

	if (error) {
		return (
			<ErrorScreen
				title={error.title}
				message={error.message}
				suggestion={error.suggestion}
				headerText={`${config.baseTitle} - API Keys - Create`}
				onExit={() => {
					setError(null);
					onExit();
				}}
				showRetry={true}
				onRetry={() => {
					setError(null);
				}}
			/>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - API Keys - Create`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			<Box flexDirection="column" marginTop={1}>
				{formError && (
					<Box marginBottom={1}>
						<Alert variant="error">{formError}</Alert>
					</Box>
				)}
				{visibleFields.map((field, index) => {
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

					const isDisabled = field.name === 'domain_id' && formData.permission === 'full_access';
					return (
						<TextInput
							key={field.name}
							label={field.label}
							value={String(formData[field.name] || '')}
							onChange={(value) => handleFieldChange(field.name, value)}
							placeholder={field.placeholder}
							helpText={isDisabled ? 'Only available for sending_access permission' : field.helpText}
							isFocused={currentField === index}
							error={errors[field.name]}
							disabled={isDisabled}
						/>
					);
				})}
			</Box>
		</Layout>
	);
};
