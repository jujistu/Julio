import React, { useContext } from 'react';
import { ReactNode, createContext, useState } from 'react';

type UserContext = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
};

export const UserType = createContext<UserContext | null>(null);

export const UserContext = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>('');

  return (
    <UserType.Provider value={{ userId, setUserId }}>
      {children}
    </UserType.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserType);

  if (context === null) {
    throw new Error(
      'useUserContext must be used within an UserContextProvider'
    );
  }

  return context;
};
