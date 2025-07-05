import meow from 'meow';
import { flagsToSendEmailData, SEND_EMAIL_SCHEMA, validateSendEmailData } from './validation.js';

// Generate CLI flags configuration from schema
function generateCliFlags() {
	// biome-ignore lint/suspicious/noExplicitAny: Meow library requires dynamic flag types
	const flags: Record<string, any> = {};

	for (const field of Object.values(SEND_EMAIL_SCHEMA)) {
		// biome-ignore lint/suspicious/noExplicitAny: Meow library requires dynamic flag types
		const flagConfig: any = {
			type: 'string',
		};

		if ('shortFlag' in field.cliFlag) {
			flagConfig.shortFlag = field.cliFlag.shortFlag;
		}

		if ('isMultiple' in field.cliFlag) {
			flagConfig.isMultiple = field.cliFlag.isMultiple;
		}

		flags[field.cliFlag.name] = flagConfig;
	}

	return flags;
}

// Generate help text from schema
function generateHelpText() {
	const options = Object.values(SEND_EMAIL_SCHEMA)
		.map((field) => {
			const shortFlag = 'shortFlag' in field.cliFlag ? `, -${field.cliFlag.shortFlag}` : '';
			return `	  --${field.cliFlag.name}${shortFlag}        ${field.description}`;
		})
		.join('\n');

	return `
	Usage
	  $ resend-cli email send [options]

	Options
${options}
	  --help, -h        Show help
	  --version, -v     Show version

	Examples
	  $ resend-cli email send --from="sender@domain.com" --to="user@example.com" --subject="Hello" --html="<h1>Hello World</h1>"
	  $ resend-cli email send -f sender@domain.com -t user@example.com -s "Hello" --text="Hello World"
	  $ export RESEND_API_KEY="re_xxxxx" && resend-cli email send --from="..." --to="..." --subject="..." --html="..."
`;
}

export const sendEmailCli = meow(generateHelpText(), {
	importMeta: import.meta,
	flags: generateCliFlags(),
});

export function validateSendEmailArgs(flags: typeof sendEmailCli.flags) {
	// Convert CLI flags to our schema format
	const emailData = flagsToSendEmailData(flags);

	// Use shared validation
	return validateSendEmailData(emailData);
}
