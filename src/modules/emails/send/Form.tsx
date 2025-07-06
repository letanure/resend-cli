import type { CreateEmailOptions } from 'resend';
import { type FormField, SimpleForm } from '@/components/forms/SimpleForm.js';
import { Layout } from '@/components/ui/layout.js';
import { config } from '@/config/config.js';
import { useResend } from '@/contexts/ResendProvider.js';
import { sendEmailAction } from './action.js';
import { fields } from './fields.js';
import { CreateEmailOptionsSchema, type CreateEmailOptionsType } from './schema.js';

interface FormProps {
	onExit: () => void;
	onEmailSent?: (emailId: string) => void;
	onEmailError?: (error: string) => void;
}

const tuiFields: Array<FormField> = fields.map((field) => ({
	name: field.name,
	label: field.label,
	placeholder: field.placeholder,
	helpText: field.helpText,
	type: field.type,
}));

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
				fields={tuiFields}
				validateWith={CreateEmailOptionsSchema}
				onSubmit={handleSubmit}
				onCancel={onExit}
			/>
		</Layout>
	);
};
