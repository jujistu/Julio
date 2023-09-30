import React, { useContext, useEffect } from 'react';
import { ReactNode, createContext, useState } from 'react';
import { fetchUserProfile } from '../hooks/Helpers';

type UserContext = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  setUser: React.Dispatch<any>;
  selectedAddress: any;
  setSelectedAddress: React.Dispatch<any>;
};

export const UserType = createContext<UserContext | null>(null);

export const UserContext = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>();

  useEffect(() => {
    fetchUserProfile(setUser, userId);
  }, [userId]);

  return (
    <UserType.Provider
      value={{
        userId,
        setUserId,
        setUser,
        user,
        selectedAddress,
        setSelectedAddress,
      }}
    >
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
