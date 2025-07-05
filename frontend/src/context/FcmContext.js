import React, {createContext, useState, useContext} from 'react';

const FcmContext = createContext();

export const FcmProvider = ({children}) => {
  const [fcmToken, setFcmToken] = useState('');

  return (
    <FcmContext.Provider value={{fcmToken, setFcmToken}}>
      {children}
    </FcmContext.Provider>
  );
};

export const useFcmContext = () => useContext(FcmContext);
