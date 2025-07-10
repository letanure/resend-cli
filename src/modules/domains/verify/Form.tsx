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
import { verifyDomain } from './action.js';
import { verifyDomainFields } from './fields.js';
import { type VerifyDomainData, verifyDomainSchema } from './schema.js';

interface VerifyDomainResponse {
	object: 'domain';
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<VerifyDomainResponse> | null>(null);
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
		return verifyDomainFields.map((field) => {
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

	const handleSubmit = async (data: VerifyDomainData) => {
		setLoading(true);
		if (isDryRun) {
			setSuccessData({
				'Domain ID': data.domainId,
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Domain not verified due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await verifyDomain(data, apiKey);
			if (result.success && result.data) {
				setSuccessData({
					'Domain ID': result.data.id,
					Object: result.data.object,
				});
				setIsDryRunSuccess(false);
			} else {
				setResult(result);
			}
		}
		setLoading(false);
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading) {
			onExit();
		}
	});

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Domain Verified Successfully"
				headerText={`${config.baseTitle} - Domains - Verify`}
				isDryRun={isDryRunSuccess}
				onExit={() => {
					setSuccessData(null);
					setIsDryRunSuccess(false);
					onExit();
				}}
			/>
		);
	}

	if (loading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Domains - Verify`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Verifying domain..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		return (
			<ErrorScreen
				title="Domain Verification Failed"
				message={result.error || 'Failed to verify domain'}
				suggestion="Check the domain ID and ensure DNS records are properly configured."
				headerText={`${config.baseTitle} - Domains - Verify`}
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
			headerText={`${config.baseTitle} - Domains - Verify`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<VerifyDomainData>
				fields={formFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={verifyDomainSchema}
				initialData={initialFormData}
			/>
		</Layout>
	);
};
