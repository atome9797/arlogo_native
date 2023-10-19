import {createContext} from 'react';
import {LogoContextTypes} from './types.d';

export const LogoContext = createContext<LogoContextTypes | null>(null);

export const LogoContextProvider = LogoContext.Provider;
