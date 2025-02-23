import React, { createContext, useState, ReactNode } from 'react';

interface ErrorContextProps {
  errors: Record<string, string>;
  setFormErrors: (error: Record<string, string>) => void;
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setFormErrors = (error: Record<string, string>) => {
    setErrors(error);
  };

  return (
    <ErrorContext.Provider value={{ errors, setFormErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextProps => {
  const context = React.useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
