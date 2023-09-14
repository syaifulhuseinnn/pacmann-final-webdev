import React, { createContext, useState, useEffect } from "react";
import { User } from "../types/user";

interface Props {
  children: React.ReactNode;
}

const initialState: User = {
  email: "",
  userId: "",
};

const UserContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}>({ user: initialState, setUser: () => null });

const UserProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User>(initialState);

  useEffect(() => {
    if (user.email && user.userId) {
      console.log("Session Storage Saved!");
      sessionStorage.setItem("user_account", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (!user.email && !user.userId) {
      const userAccount = JSON.parse(
        `${sessionStorage.getItem("user_account")}`
      );

      if (userAccount) {
        console.info(
          "User Context: User state empty. Get and Set from sessionStorage"
        );
        setUser(userAccount);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
