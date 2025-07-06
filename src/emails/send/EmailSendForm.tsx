import { FormLayout } from '../../components/forms/FormLayout.js';
import { type FormField, SimpleForm } from '../../components/forms/SimpleForm.js';
import { Layout } from '../../components/ui/layout.js';
import { config } from '../../config.js';
import { CreateEmailOptionsSchema } from './schema.js';

interface EmailSendFormProps {
	onExit: () => void;
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

export const EmailSendForm = ({ onExit }: EmailSendFormProps) => {
	console.log('📧 EmailSendForm initialized');
	const handleSubmit = (data: Record<string, string>) => {
		console.log('📧 EmailSendForm:', JSON.stringify(data, null, 2));
		// transform comma-separated fields to arrays
		const transformed = {
			...data,
			to: data.to?.includes(',') ? data.to.split(',').map((s) => s.trim()) : data.to,
			cc: data.cc?.includes(',') ? data.cc.split(',').map((s) => s.trim()) : data.cc,
			bcc: data.bcc?.includes(',') ? data.bcc.split(',').map((s) => s.trim()) : data.bcc,
			reply_to: data.reply_to?.includes(',') ? data.reply_to.split(',').map((s) => s.trim()) : data.reply_to,
		};

		// remove empty optional fields
		Object.keys(transformed).forEach((key) => {
			const value = transformed[key as keyof typeof transformed];
			if (!value || value === '') {
				delete transformed[key as keyof typeof transformed];
			}
		});

		// validate with zod
		const result = CreateEmailOptionsSchema.safeParse(transformed);

		if (!result.success) {
			console.error('❌ Validation errors:');
			console.error(result.error.format());
			return;
		}

		console.log('📧 Validated email data:', result.data);

		// Additional validation: at least one of HTML or text is required
		// if (!data.html && !data.text) {
		// 	console.error('❌ Error: Either HTML or plain text content is required');
		// 	return;
		// }

		// // Transform comma-separated values to arrays for multiple recipients
		// const processedData = {
		// 	...data,
		// 	to: data.to?.includes(',') ? data.to.split(',').map((s) => s.trim()) : data.to,
		// 	cc: data.cc?.includes(',') ? data.cc.split(',').map((s) => s.trim()) : data.cc,
		// 	bcc: data.bcc?.includes(',') ? data.bcc.split(',').map((s) => s.trim()) : data.bcc,
		// 	reply_to: data.reply_to?.includes(',') ? data.reply_to.split(',').map((s) => s.trim()) : data.reply_to,
		// };

		// // Remove empty optional fields
		// Object.keys(processedData).forEach((key) => {
		// 	const value = processedData[key as keyof typeof processedData];
		// 	if (!value || value === '') {
		// 		delete processedData[key as keyof typeof processedData];
		// 	}
		// });

		// console.log('📧 Email Send Data:', JSON.stringify(processedData, null, 2));
		// // TODO: Integrate with sendEmailAction
		// onExit();
	};

	return (
		<Layout headerText={`${config.baseTitle} - Emails - Send`}>
			<FormLayout title="📧 Send Email 0" description="Send an email through the Resend API">
				<SimpleForm
					fields={emailFields}
					validateWith={CreateEmailOptionsSchema}
					onSubmit={handleSubmit}
					onCancel={onExit}
				/>
			</FormLayout>
		</Layout>
	);
};
