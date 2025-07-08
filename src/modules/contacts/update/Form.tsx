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
import { updateContact } from './action.js';
import { updateContactFields } from './fields.js';
import { type UpdateContactData, updateContactSchema } from './schema.js';

interface UpdateContactResponse {
	object: string;
	id: string;
}

interface ContactUpdateFormProps {
	onExit: () => void;
}

export const ContactUpdateForm = ({ onExit }: ContactUpdateFormProps) => {
	const [result, setResult] = React.useState<ApiResult<UpdateContactResponse> | null>(null);
	const [loading, setLoading] = React.useState(false);
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();

	const handleSubmit = async (data: UpdateContactData) => {
		setLoading(true);
		const result = await updateContact(data, apiKey);
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
			<Layout headerText={`${config.baseTitle} - Contacts - Update`}>
				<Box marginBottom={1}>
					<Spinner label="Updating contact..." />
				</Box>
			</Layout>
		);
	}

	if (result) {
		if (result.success && result.data) {
			return <ContactUpdateDisplay result={result.data} onExit={onExit} />;
		}
		return (
			<Layout headerText={`${config.baseTitle} - Contacts - Update`}>
				<ErrorDisplay message={result.error || 'Failed to update contact'} />
				<Box marginTop={1}>
					<Text>
						Press <Text color="yellow">Esc</Text> or <Text color="yellow">q</Text> to go back
					</Text>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout headerText={`${config.baseTitle} - Contacts - Update`}>
			{isDryRun && (
				<Box marginBottom={1}>
					<Alert variant="warning">DRY RUN MODE - No API calls will be made</Alert>
				</Box>
			)}
			<SimpleForm<UpdateContactData>
				fields={updateContactFields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={updateContactSchema}
			/>
		</Layout>
	);
};

interface ContactUpdateDisplayProps {
	result: UpdateContactResponse;
	onExit: () => void;
}

const ContactUpdateDisplay = ({ result, onExit }: ContactUpdateDisplayProps) => {
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			onExit();
		}
	});

	return (
		<Layout headerText={`${config.baseTitle} - Contacts - Update`}>
			<Box flexDirection="column" gap={1}>
				<Box>
					<Alert variant="success">Contact updated successfully</Alert>
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
								Contact ID:
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
