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
import { deleteBroadcast } from './action.js';
import { deleteBroadcastFields } from './fields.js';
import { type DeleteBroadcastData, deleteBroadcastSchema } from './schema.js';

interface DeleteBroadcastResponse {
	object: string;
	id: string;
	deleted: boolean;
}

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const [result, setResult] = React.useState<ApiResult<DeleteBroadcastResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: DeleteBroadcastData) => {
		setLoading(true);
		const result = await deleteBroadcast(data, apiKey);
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
				headerText={`${config.baseTitle} - Broadcasts - Delete`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Box marginBottom={1}>
					<Spinner label="Deleting broadcast..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <BroadcastDeleteDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout
				headerText={`${config.baseTitle} - Broadcasts - Delete`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<ErrorDisplay message={result.error || 'Failed to delete broadcast'} />
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
			headerText={`${config.baseTitle} - Broadcasts - Delete`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<DeleteBroadcastData>
				fields={deleteBroadcastFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={deleteBroadcastSchema}
			/>
			<Box marginTop={1}>
				<Alert variant="info">
					Note: You can only delete broadcasts that are in draft status or scheduled broadcasts (which will cancel
					delivery).
				</Alert>
			</Box>
		</Layout>
	);
};

interface BroadcastDeleteDisplayProps {
	result: DeleteBroadcastResponse;
	onExit: () => void;
}

const BroadcastDeleteDisplay = ({ result, onExit }: BroadcastDeleteDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout
			headerText={`${config.baseTitle} - Broadcasts - Delete`}
			showNavigationInstructions={true}
			navigationContext="result"
		>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Broadcast {result.deleted ? 'deleted' : 'processed'} successfully</Alert>
				</Box>

				<Box flexDirection="column">
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Object:
							</Text>
						</Box>
						<Text color="gray">{result.object}</Text>
					</Box>
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Broadcast ID:
							</Text>
						</Box>
						<Text color="gray">{result.id}</Text>
					</Box>
					<Box>
						<Box width={20}>
							<Text bold={true} color="cyan">
								Deleted:
							</Text>
						</Box>
						<Text color={result.deleted ? 'green' : 'yellow'}>{result.deleted ? 'Yes' : 'No'}</Text>
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
