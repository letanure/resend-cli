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
import { updateBroadcast } from './action.js';
import { updateBroadcastFields } from './fields.js';
import { type UpdateBroadcastData, updateBroadcastSchema } from './schema.js';

interface UpdateBroadcastResponse {
	id: string;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<UpdateBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: UpdateBroadcastData) => {
		setLoading(true);
		const result = await updateBroadcast(data, apiKey);
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
				headerText={`${config.baseTitle} - Broadcasts - Update`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Updating broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <BroadcastUpdateDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<ErrorScreen
				title="Broadcast Update Failed"
				message={result.error || 'Failed to update broadcast'}
				suggestion="Check the broadcast ID and ensure it exists in your Resend account."
				headerText={`${config.baseTitle} - Broadcasts - Update`}
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
			headerText={`${config.baseTitle} - Broadcasts - Update`}
			showNavigationInstructions={true}
			navigationContext="form"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<UpdateBroadcastData>
				fields={updateBroadcastFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={updateBroadcastSchema}
			/>
		</Layout>
	);
};

interface BroadcastUpdateDisplayProps {
	result: UpdateBroadcastResponse;
	onExit: () => void;
}

const BroadcastUpdateDisplay = ({ result, onExit }: BroadcastUpdateDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Update`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Broadcast updated successfully</Alert>
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
