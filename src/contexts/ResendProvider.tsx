import { Alert } from '@inkjs/ui';
import { createContext, type ReactNode, useContext } from 'react';

interface ResendContextType {
	apiKey: string;
}

const ResendContext = createContext<ResendContextType | null>(null);

interface ResendProviderProps {
	children: ReactNode;
}

export const ResendProvider = ({ children }: ResendProviderProps) => {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		return (
			<Alert variant="warning">
				Missing RESEND_API_KEY environment variable. Please set it to use the CLI.{'\n'}
				Get your API key at https://resend.com/docs/dashboard/api-keys/introduction
			</Alert>
		);
	}

	return <ResendContext.Provider value={{ apiKey }}>{children}</ResendContext.Provider>;
};

export const useResend = (): ResendContextType => {
	const context = useContext(ResendContext);
	if (!context) {
		throw new Error('useResend must be used within a ResendProvider');
	}
	return context;
};
