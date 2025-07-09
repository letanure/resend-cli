import { Spinner } from '@inkjs/ui';
import { Box, Text, useInput } from 'ink';
import { useState } from 'react';
import { SimpleForm } from '@/components/forms/SimpleForm.js';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay.js';
import { Layout } from '@/components/ui/layout.js';
import { Table } from '@/components/ui/Table.js';
import { config } from '@/config/config.js';
import { useDryRun } from '@/contexts/DryRunProvider.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { listContacts } from './action.js';
import { displayFields, fields } from './fields.js';
import { ListContactsOptionsSchema, type ListContactsOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
}

export const Form = ({ onExit }: FormProps) => {
	const { isDryRun } = useDryRun();
	const { apiKey } = useResend();
	const [isLoading, setIsLoading] = useState(false);
	const [contactsList, setContactsList] = useState<Array<Record<string, unknown>> | null>(null);
	const [showDryRunData, setShowDryRunData] = useState<Array<Record<string, unknown>> | null>(null);
	const [error, setError] = useState<{ title: string; message: string; suggestion?: string } | null>(null);

	// Handle Esc key to go back from result screens
	useInput(
		(_input, key) => {
			if ((key.escape || key.leftArrow) && (contactsList || showDryRunData || error)) {
				setContactsList(null);
				setShowDryRunData(null);
				setError(null);
			}
		},
		{ isActive: !!(contactsList || showDryRunData || error) },
	);

	const handleSubmit = async (data: ListContactsOptionsType) => {
		setIsLoading(true);
		try {
			if (isDryRun) {
				// Show mock data for dry run
				setShowDryRunData([
					{
						id: 'dry-run-contact-1',
						email: 'user1@example.com',
						firstName: 'John',
						lastName: 'Doe',
						created_at: '2023-10-06T22:59:55.977Z',
						subscribed: 'Yes',
					},
					{
						id: 'dry-run-contact-2',
						email: 'user2@example.com',
						firstName: 'Jane',
						lastName: 'Smith',
						created_at: '2023-10-07T10:30:12.123Z',
						subscribed: 'No',
					},
				]);
			} else {
				const result = await listContacts(data, apiKey);

				if (result.success && result.data) {
					// Convert the list response to array format for table
					const contacts = result.data.data || [];
					setContactsList(
						contacts.map((contact) => ({
							id: contact.id,
							email: contact.email,
							firstName: contact.first_name || 'Not specified',
							lastName: contact.last_name || 'Not specified',
							created_at: contact.created_at,
							subscribed: contact.unsubscribed ? 'No' : 'Yes',
						})),
					);
				} else {
					setError({
						title: 'Failed to Load Contacts',
						message: result.error || 'Unknown error occurred',
						suggestion: 'Check the audience ID and ensure it exists in your Resend account',
					});
				}
			}
		} catch (error) {
			setError({
				title: 'Contact List Error',
				message: error instanceof Error ? error.message : 'Unknown error',
				suggestion: 'Please check your API key and network connection',
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - List`}
				showNavigationInstructions={false}
				navigationContext="none"
			>
				<Spinner label="Loading contacts..." />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - List - Error`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<ErrorDisplay title={error.title} message={error.message} suggestion={error.suggestion} />
					</Box>
					<Box>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	if (showDryRunData) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - List - Dry Run`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Box marginBottom={1}>
						<Text bold={true} color="yellow">
							DRY RUN - Sample contact list data (not from API)
						</Text>
					</Box>
					<Table data={showDryRunData} fields={displayFields} title="Contacts" />
					<Box marginTop={1}>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	if (contactsList) {
		return (
			<Layout
				headerText={`${config.baseTitle} - Contacts - List`}
				showNavigationInstructions={true}
				navigationContext="result"
			>
				<Box flexDirection="column">
					<Table data={contactsList} fields={displayFields} title="Contacts" />
					<Box marginTop={1}>
						<Text dimColor={true}>Press Esc to go back</Text>
					</Box>
				</Box>
			</Layout>
		);
	}

	return (
		<Layout
			headerText={`${config.baseTitle} - Contacts - List`}
			showNavigationInstructions={true}
			navigationContext="form-single"
		>
			<SimpleForm<ListContactsOptionsType>
				fields={fields}
				onSubmit={handleSubmit}
				onCancel={onExit}
				validateWith={ListContactsOptionsSchema}
			/>
		</Layout>
	);
};
