import { Alert, Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { useDomainSelector } from '@/hooks/useDomainSelector.js';
import type { ApiResult } from '@/types/index.js';
import { updateDomain } from './action.js';
import { updateDomainFields } from './fields.js';
import { type UpdateDomainData, updateDomainSchema } from './schema.js';

interface UpdateDomainResponse {
	object: 'domain';
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<UpdateDomainResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
	const [selectedDomainId, setSelectedDomainId] = React.useState<string>('');
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const initialFormData = React.useMemo(() => {
		return selectedDomainId ? { domainId: selectedDomainId } : undefined;
	}, [selectedDomainId]);

	const domainSelector = useDomainSelector((domainId) => {
		setSelectedDomainId(domainId);
	});

	// Create form fields with domain selector
	const formFields = React.useMemo(() => {
		return updateDomainFields.map((field) => {
			if (field.name === 'domainId') {
				return {
					...field,
					type: 'input-with-selector' as const,
					onSelectorOpen: domainSelector.openSelector,
				};
			}
			return field;
		});
	}, [domainSelector.openSelector]);

	const handleSubmit = async (data: UpdateDomainData) => {
		setLoading(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Domain ID': data.domainId,
					'Click Tracking': data.clickTracking ? 'Enabled' : 'Disabled',
					'Open Tracking': data.openTracking ? 'Enabled' : 'Disabled',
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (Domain not updated due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await updateDomain(data, apiKey);
				if (result.success && result.data) {
					setSuccessData({
						'Domain ID': result.data.id,
						'Object Type': result.data.object,
						Status: 'Updated successfully',
					});
					setIsDryRunSuccess(false);
				} else {
					// Handle API error case
					setResult(result);
				}
			}
		} catch (error) {
			setResult({
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: undefined,
			});
		} finally {
			setLoading(false);
		}
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading && !successData) {
			onExit();
		}
		if ((input === 'q' || key.escape) && successData) {
			setSuccessData(null);
			setIsDryRunSuccess(false);
		}
	});

	if (loading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Domains - Update`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Updating domain..." />
				</Box>
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Domain Updated Successfully"
				headerText={`${config.baseTitle} - Domains - Update`}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

	if (result) {
		if (result.success && result.data) {
			// This case is now handled by successData above
			return null;
		}
		return (
			<ErrorScreen
				title="Domain Update Failed"
				message={result.error || 'Failed to update domain'}
				suggestion="Check the domain ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Domains - Update`}
				onExit={() => {
					setResult(null);
					onExit();
				}}
				showRetry={true}
				onRetry={() => {
					setResult(null);
					setLoading(false);
				}}
			/>
		);
	}

	// If the domain selector is open, render it instead of the form
	if (domainSelector.isOpen) {
		return domainSelector.selectorComponent;
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Domains - Update`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<UpdateDomainData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={updateDomainSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
