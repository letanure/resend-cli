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
import { sendBroadcast } from './action.js';
import { sendBroadcastFields } from './fields.js';
import { type SendBroadcastData, sendBroadcastSchema } from './schema.js';

interface SendBroadcastResponse {
	id: string;
}

interface BroadcastSendFormProps {
	onExit: () => void;
}

export const BroadcastSendForm = ({ onExit }: BroadcastSendFormProps) => {
	const [result, setResult] = React.useState<ApiResult<SendBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: SendBroadcastData) => {
		setLoading(true);
		const result = await sendBroadcast(data, apiKey);
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
			<Layout headerText={`${config.baseTitle} - Broadcasts - Send`}>
				<Box marginBottom={1}>
					<Spinner label="Sending broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <BroadcastSendDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout headerText={`${config.baseTitle} - Broadcasts - Send`}>
				<ErrorDisplay message={result.error || 'Failed to send broadcast'} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts - Send`}>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<SendBroadcastData>
				fields={sendBroadcastFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={sendBroadcastSchema}
			/>
		</Layout>
	);
};

interface BroadcastSendDisplayProps {
	result: SendBroadcastResponse;
	onExit: () => void;
}

const BroadcastSendDisplay = ({ result, onExit }: BroadcastSendDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Broadcasts - Send`}>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Broadcast sent successfully</Alert>
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
