import { Alert, Badge, Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import React from 'react';
import type { GetDomainResponseSuccess } from 'resend';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorScreen } from '@/components/ui/ErrorScreen.js';
import { Layout } from '@/components/ui/layout.js';
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
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: RetrieveDomainData) => {
		setLoading(true);
		const result = await retrieveDomain(data, apiKey);
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
		if (result.success && result.data) {
			return <DomainDisplay domain={result.data} onExit={onExit} />;
		}
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

interface DomainDisplayProps {
	domain: GetDomainResponseSuccess;
	onExit: () => void;
}

const DomainDisplay = ({ domain, onExit }: DomainDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'verified':
				return 'green';
			case 'pending':
				return 'yellow';
			case 'failed':
			case 'temporary_failure':
				return 'red';
			default:
				return 'gray';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'verified':
				return 'Verified';
			case 'pending':
				return 'Pending';
			case 'failed':
				return 'Failed';
			case 'temporary_failure':
				return 'Temporary Failure';
			case 'not_started':
				return 'Not Started';
			default:
				return status;
		}
	};

	return (
		<Layout
			headerText={`${config.baseTitle} - Domains - Retrieve`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Domain retrieved successfully</Alert>
				</Box>

				<Box flexDirection="column">
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Domain:
							</Text>
						</Box>
						<Text>{domain.name}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								ID:
							</Text>
						</Box>
						<Text color="gray">{domain.id}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Status:
							</Text>
						</Box>
						<Badge color={getStatusColor(domain.status)}>{getStatusLabel(domain.status)}</Badge>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Region:
							</Text>
						</Box>
						<Text>{domain.region}</Text>
					</Box>

					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Created:
							</Text>
						</Box>
						<Text>{new Date(domain.created_at).toLocaleString()}</Text>
					</Box>
				</Box>

				{domain.records && domain.records.length > 0 && (
					<Box flexDirection="column">
						<Text bold={true} color="cyan">
							DNS Records:
						</Text>
						{domain.records.map((record) => (
							<Box key={`${record.record}-${record.name}`} flexDirection="column" marginTop={1} paddingLeft={2}>
								<Box>
									<Badge color="blue">{record.record}</Badge>
									<Text> </Text>
									<Badge color={getStatusColor(record.status)}>{getStatusLabel(record.status)}</Badge>
								</Box>
								<Box paddingLeft={2} flexDirection="column">
									<Text>
										<Text bold={true}>Type:</Text> {record.type}
									</Text>
									<Text>
										<Text bold={true}>Name:</Text> {record.name}
									</Text>
									<Text>
										<Text bold={true}>Value:</Text> {record.value}
									</Text>
									{record.priority !== undefined && (
										<Text>
											<Text bold={true}>Priority:</Text> {record.priority}
										</Text>
									)}
									<Text>
										<Text bold={true}>TTL:</Text> {record.ttl}
									</Text>
								</Box>
							</Box>
						))}
					</Box>
				)}

				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Box>
		</Layout>
	);
};
