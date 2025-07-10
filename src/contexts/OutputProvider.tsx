import { createContext, useContext } from 'react';
import type { OutputFormat } from '@/utils/output.js';

interface OutputContextType {
	outputFormat: OutputFormat;
}

interface OutputProviderProps {
	outputFormat?: OutputFormat;
	children: React.ReactNode;
}

const OutputContext = createContext<OutputContextType>({
	outputFormat: 'text',
});

export const OutputProvider = ({ outputFormat = 'text', children }: OutputProviderProps) => {
	return <OutputContext.Provider value={{ outputFormat }}>{children}</OutputContext.Provider>;
};

export const useOutput = (): OutputContextType => {
	return useContext(OutputContext);
};
