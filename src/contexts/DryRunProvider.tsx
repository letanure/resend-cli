import { createContext, type ReactNode, useContext } from 'react';

interface DryRunContextType {
	isDryRun: boolean;
}

const DryRunContext = createContext<DryRunContextType | null>(null);

interface DryRunProviderProps {
	children: ReactNode;
	isDryRun?: boolean;
}

export const DryRunProvider = ({ children, isDryRun = false }: DryRunProviderProps) => {
	return <DryRunContext.Provider value={{ isDryRun }}>{children}</DryRunContext.Provider>;
};

export const useDryRun = (): DryRunContextType => {
	const context = useContext(DryRunContext);
	if (!context) {
		throw new Error('useDryRun must be used within a DryRunProvider');
	}
	return context;
};
