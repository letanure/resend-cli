import type { CreateEmailOptions } from 'resend';
import { type FormField, SimpleForm } from '@/components/forms/SimpleForm.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { sendEmailAction } from './action.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
	onEmailSent?: (emailId: string) => void;
	onEmailError?: (error: string) => void;
}

const emailFields: Array<FormField> = [
	// Required fields
	{
		name: 'from',
		label: 'From',
		placeholder: 'Your Name <sender@domain.com>',
		helpText: 'Sender email address with optional name',
		required: true,
	},
	{
		name: 'to',
		label: 'To',
		placeholder: 'recipient@domain.com',
		helpText: 'Recipient email(s) - comma separated for multiple (max 50)',
		required: true,
	},
	{
		name: 'subject',
		label: 'Subject',
		placeholder: 'Enter email subject',
		helpText: 'Email subject line',
		required: true,
	},
	{
		name: 'bcc',
		label: 'BCC',
		placeholder: 'bcc@domain.com',
		helpText: 'Blind carbon copy recipients - comma separated',
	},
	{
		name: 'cc',
		label: 'CC',
		placeholder: 'cc@domain.com',
		helpText: 'Carbon copy recipients - comma separated for multiple',
	},
	{
		name: 'scheduled_at',
		label: 'Schedule',
		placeholder: 'in 1 hour OR 2024-08-05T11:52:01.858Z',
		helpText: 'Natural language (in 1 min) or ISO 8601 format',
	},
	{
		name: 'reply_to',
		label: 'Reply To',
		placeholder: 'reply@domain.com',
		helpText: 'Reply-to address(es) - comma separated',
	},
	{
		name: 'html',
		label: 'HTML Content',
		placeholder: '<p>Your HTML content here</p>',
		helpText: 'HTML version of the message (optional if text provided)',
		type: 'textarea',
	},
	{
		name: 'text',
		label: 'Plain Text',
		placeholder: 'Your plain text message here...',
		helpText: 'Plain text version (optional if HTML provided)',
		type: 'textarea',
	},
	// react React.ReactNode
	// headers object Custom headers to add to the email.
	// attachments array
	// tags array Custom data passed in key/value pairs.
];

export const Form = ({ onExit, onEmailSent, onEmailError }: FormProps) => {
	const { apiKey } = useResend();

	const handleSubmit = async (validatedData: CreateEmailOptionsType) => {
		// Data is already validated and transformed by SimpleForm + Zod schema
		// Type assertion is safe here because Zod validation ensures compatibility
		const result = await sendEmailAction(validatedData as CreateEmailOptions, apiKey);

		if (result.success && result.data?.id) {
			if (onEmailSent) {
				onEmailSent(result.data.id);
			} else {
				console.log(`✅ Email sent successfully! ID: ${result.data.id}`);
				onExit();
			}
			return;
		}

		if (onEmailError) {
			const errorMessage = result.error || 'Unknown error occurred';
			onEmailError(errorMessage);
		} else {
			console.error(`❌ Failed to send email: ${result.error}`);
		}
	};

	return (
		<Layout headerText={`${config.baseTitle} - Emails - Send`}>
			<SimpleForm<CreateEmailOptionsType>
				fields={emailFields}
				validateWith={CreateEmailOptionsSchema}
				onSubmit={handleSubmit}
				onCancel={onExit}
			/>
		</Layout>
	);
};
