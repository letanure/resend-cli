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
import { createBroadcast } from './action.js';
import { createBroadcastFields } from './fields.js';
import { type CreateBroadcastData, createBroadcastSchema } from './schema.js';

interface CreateBroadcastResponse {
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<CreateBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: CreateBroadcastData) => {
		setLoading(true);
		const result = await createBroadcast(data, apiKey);
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
				headerText={`${config.baseTitle} - Broadcasts - Create`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Creating broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <BroadcastCreateDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout
				headerText={`${config.baseTitle} - Broadcasts - Create`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<ErrorDisplay message={result.error || 'Failed to create broadcast'} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Create`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<CreateBroadcastData>
				fields={createBroadcastFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={createBroadcastSchema}
			/>
		</Layout>
	);
};

interface BroadcastCreateDisplayProps {
	result: CreateBroadcastResponse;
	onExit: () => void;
}

const BroadcastCreateDisplay = ({ result, onExit }: BroadcastCreateDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Create`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Broadcast created successfully</Alert>
				</Box>

				<Box flexDirection="column">
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Broadcast ID:
							</Text>
						</Box>
						<Text color="gray">{result.id}</Text>
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
