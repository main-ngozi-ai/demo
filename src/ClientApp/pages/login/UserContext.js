import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext({
    user:   null,
    setUser: () => {},
  });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { exp } = decoded;
        const savedUserId = localStorage.getItem('userId');
        if (Date.now() < exp * 1000 && savedUserId !== null) {
          setUser({ id: savedUserId }); 
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
        }
      } catch (error) {
        console.error('Decoding token failed:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};