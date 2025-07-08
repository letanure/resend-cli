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
import { deleteDomain } from './action.js';
import { deleteDomainFields } from './fields.js';
import { type DeleteDomainData, deleteDomainSchema } from './schema.js';

interface DeleteDomainResponse {
	object: 'domain';
	id: string;
	deleted: true;
}

interface DomainDeleteFormProps {
	onExit: () => void;
}

export const DomainDeleteForm = ({ onExit }: DomainDeleteFormProps) => {
	const [result, setResult] = React.useState<ApiResult<DeleteDomainResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: DeleteDomainData) => {
		setLoading(true);
		const result = await deleteDomain(data, apiKey);
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
			<Layout headerText={`${config.baseTitle} - Domains - Delete`}>
				<Box marginBottom={1}>
					<Spinner label="Deleting domain..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <DomainDeleteDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout headerText={`${config.baseTitle} - Domains - Delete`}>
				<ErrorDisplay message={result.error || 'Failed to delete domain'} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - Domains - Delete`}>
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

interface DomainDeleteDisplayProps {
	result: DeleteDomainResponse;
	onExit: () => void;
}

const DomainDeleteDisplay = ({ result, onExit }: DomainDeleteDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Domains - Delete`}>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Domain deleted successfully</Alert>
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
								Status:
							</Text>
						</Box>
						<Text color="red">Deleted</Text>
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
