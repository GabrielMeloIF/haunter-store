import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userImage, setUserImage] = useState(null);


    const context = useContext(UserContext);
  return (
    <UserContext.Provider value={{ userImage, setUserImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);