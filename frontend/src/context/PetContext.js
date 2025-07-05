import React, {createContext, useState} from 'react';

export const PetContext = createContext();

export const PetProvider = ({children}) => {
  const [petId, setPetId] = useState(null);

  return (
    <PetContext.Provider value={{petId, setPetId}}>
      {children}
    </PetContext.Provider>
  );
};
