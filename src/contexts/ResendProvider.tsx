import { Alert } from '@inkjs/ui';
import { createContext, type ReactNode, useContext } from 'react';
import { getResendApiKeyDocsUrl, getResendApiKeyOrNull } from '@/utils/resend-api.js';

interface ResendContextType {
	apiKey: string;
}

const ResendContext = createContext<ResendContextType | null>(null);

interface ResendProviderProps {
	children: ReactNode;
	apiKey?: string; // Optional API key from command line or other sources
}

export const ResendProvider = ({ children, apiKey: providedApiKey }: ResendProviderProps) => {
	// Priority order: 1) Environment variable, 2) Provided API key
	const apiKey = getResendApiKeyOrNull() || providedApiKey;

	if (!apiKey) {
		return (
			<Alert variant="warning">
				Missing RESEND_API_KEY environment variable or --api-key option. Please set one to use the CLI.{'\n'}
				Get your API key at {getResendApiKeyDocsUrl()}
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
