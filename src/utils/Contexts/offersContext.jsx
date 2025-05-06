import React, { createContext, useContext, useState } from 'react';

const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const [showOffersOnly, setShowOffersOnly] = useState(false);

  return (
    <OffersContext.Provider value={{ showOffersOnly, setShowOffersOnly }}>
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => useContext(OffersContext);