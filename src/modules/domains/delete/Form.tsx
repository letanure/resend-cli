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
import type { ApiResult } from '@/types/index.js';
import { deleteDomain } from './action.js';
import { deleteDomainFields } from './fields.js';
import { type DeleteDomainData, deleteDomainSchema } from './schema.js';

interface DeleteDomainResponse {
	object: 'domain';
	id: string;
	deleted: boolean;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<DeleteDomainResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: DeleteDomainData) => {
		setLoading(true);
		try {
			if (isDryRun) {
				setSuccessData({
					'Domain ID': data.domainId,
					'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
					Status: 'Validation successful! (Domain not deleted due to dry-run mode)',
				});
				setIsDryRunSuccess(true);
			} else {
				const result = await deleteDomain(data, apiKey);
				if (result.success && result.data) {
					setSuccessData({
						'Domain ID': result.data.id,
						'Object Type': result.data.object,
						Status: 'Deleted',
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
				headerText={`${config.baseTitle} - Domains - Delete`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Deleting domain..." />
				</Box>
			</Layout>
		);
	}

	if (successData) {
		return (
			<SuccessScreen
				data={successData}
				successMessage="Domain Deleted Successfully"
				headerText={`${config.baseTitle} - Domains - Delete`}
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
				title="Domain Deletion Failed"
				message={result.error || 'Failed to delete domain'}
				suggestion="Check the domain ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Domains - Delete`}
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

	return (
		<Layout
			headerText={`${config.baseTitle} - Domains - Delete`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<DeleteDomainData>
				fields={deleteDomainFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={deleteDomainSchema}
			/>
		</Layout>
	);
};
