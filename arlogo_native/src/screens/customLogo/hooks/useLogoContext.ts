import {useContext} from 'react';
import {LogoContext} from '../context/LogoContextProvider';

export const useLogoContext = () => {
  const context = useContext(LogoContext);
  if (context === null) {
    throw "'useLogoContext' cannot be used out of the EditItemsSymbol!";
  }

  return context;
};
