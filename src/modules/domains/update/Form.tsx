import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
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
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: UpdateDomainData) => {
		setLoading(true);
		const result = await updateDomain(data, apiKey);
		setResult(result);
		setLoading(false);
	};

	useInput((input, key) => {
		if ((input === 'q' || key.escape) && !loading) {
			onExit();
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

	if (result) {
		if (result.success && result.data) {
			return <DomainUpdateDisplay result={result.data} onExit={onExit} />;
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
				fields={updateDomainFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={updateDomainSchema}
			/>
		</Layout>
	);
};

interface DomainUpdateDisplayProps {
	result: UpdateDomainResponse;
	onExit: () => void;
}

const DomainUpdateDisplay = ({ result, onExit }: DomainUpdateDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout
			headerText={`${config.baseTitle} - Domains - Update`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Domain updated successfully</Alert>
				</Box>

				<Box flexDirection="column">
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Domain ID:
							</Text>
						</Box>
						<Text color="gray">{result.id}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Object:
							</Text>
						</Box>
						<Text>{result.object}</Text>
					</Box>
				</Box>

				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Box>
		</Layout>
	);
};
