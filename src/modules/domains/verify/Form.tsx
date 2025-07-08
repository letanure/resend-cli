import { Alert, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import type { ApiResult } from '@/types/index.js';
import { verifyDomain } from './action.js';
import { verifyDomainFields } from './fields.js';
import { type VerifyDomainData, verifyDomainSchema } from './schema.js';

interface VerifyDomainResponse {
	object: 'domain';
	id: string;
}

interface DomainVerifyFormProps {
	onExit: () => void;
}

export const DomainVerifyForm = ({ onExit }: DomainVerifyFormProps) => {
	const [result, setResult] = React.useState<ApiResult<VerifyDomainResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: VerifyDomainData) => {
		setLoading(true);
		const result = await verifyDomain(data, apiKey);
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
			<Layout headerText={`${config.baseTitle} - Domains - Verify`}>
				<Box marginBottom={1}>
					<Spinner label="Verifying domain..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <DomainVerifyDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout headerText={`${config.baseTitle} - Domains - Verify`}>
				<ErrorDisplay message={result.error || 'Failed to verify domain'} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - Domains - Verify`}>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<VerifyDomainData>
				fields={verifyDomainFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={verifyDomainSchema}
			/>
		</Layout>
	);
};

interface DomainVerifyDisplayProps {
	result: VerifyDomainResponse;
	onExit: () => void;
}

const DomainVerifyDisplay = ({ result, onExit }: DomainVerifyDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Domains - Verify`}>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Domain verification completed successfully</Alert>
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
