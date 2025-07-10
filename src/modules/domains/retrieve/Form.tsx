import { Alert, Spinner } from '@inkjs/ui';
import { Box, useInput } from 'ink';
import React from 'react';
import type { GetDomainResponseSuccess } from 'resend';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { SuccessScreen } from '@/components/ui/SuccessScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { retrieveDomain } from './action.js';
import { retrieveDomainFields } from './fields.js';
import { type RetrieveDomainData, retrieveDomainSchema } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<GetDomainResponseSuccess> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [successData, setSuccessData] = React.useState<Record<string, unknown> | null>(null);
	const [isDryRunSuccess, setIsDryRunSuccess] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: RetrieveDomainData) => {
		setLoading(true);
		if (isDryRun) {
			setSuccessData({
				'Domain ID': data.domainId,
				'API Key': apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set',
				'Dry Run': 'true',
				Status: 'Validation successful! (Domain not retrieved due to dry-run mode)',
			});
			setIsDryRunSuccess(true);
		} else {
			const result = await retrieveDomain(data, apiKey);
			if (result.success && result.data) {
				setSuccessData({
					Domain: result.data.name,
					ID: result.data.id,
					Status: result.data.status,
					Region: result.data.region,
					Created: new Date(result.data.created_at).toLocaleString(),
					Records: result.data.records?.length ? `${result.data.records.length} DNS records` : 'No records',
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
				successMessage="Domain Retrieved Successfully"
				headerText={`${config.baseTitle} - Domains - Retrieve`}
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
				headerText={`${config.baseTitle} - Domains - Retrieve`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Retrieving domain..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		return (
			<ErrorScreen
				title="Domain Retrieval Failed"
				message={result.error || 'Failed to retrieve domain'}
				suggestion="Check the domain ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Domains - Retrieve`}
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
			headerText={`${config.baseTitle} - Domains - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<RetrieveDomainData>
				fields={retrieveDomainFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={retrieveDomainSchema}
			/>
		</Layout>
	);
};
