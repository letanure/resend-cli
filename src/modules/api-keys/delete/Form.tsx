import { Box, Text } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ResultScreen } from '@/components/ui/ResultScreen.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { deleteApiKey } from './action.js';
import { fields } from './fields.js';
import { type DeleteApiKeyData, deleteApiKeySchema } from './schema.js';

interface DeleteApiKeyFormProps {
	onExit: () => void;
}

export const DeleteApiKeyForm = ({ onExit }: DeleteApiKeyFormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [result, setResult] = useState<{ success: boolean; message: string; error?: string } | null>(null);

	const handleSubmit = async (data: DeleteApiKeyData) => {
		if (isDryRun) {
			setResult({
				success: true,
				message: `DRY RUN - Would delete API key: ${data.api_key_id}`,
			});
			return;
		}

		const response = await deleteApiKey(apiKey, data);

		if (response.success) {
			setResult({
				success: true,
				message: response.data?.message || 'API key deleted successfully',
			});
		} else {
			setResult({
				success: false,
				message: 'Failed to delete API key',
				error: response.error,
			});
		}
	};

	if (result) {
		return (
			<ResultScreen
				headerText={`${config.baseTitle} - API Keys - Delete - ${result.success ? 'Success' : 'Error'}`}
				type={result.success ? 'success' : 'error'}
				message={result.error || result.message}
				onContinue={onExit}
			/>
		);
	}

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold={true} color="red">
					⚠️ WARNING: This action cannot be undone!
				</Text>
			</Box>
			<Box marginBottom={1}>
				<Text dimColor={true}>
					Deleting an API key will permanently remove it and any applications using it will stop working.
				</Text>
			</Box>
			<SimpleForm<DeleteApiKeyData>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={deleteApiKeySchema}
			/>
		</Box>
	);
};
