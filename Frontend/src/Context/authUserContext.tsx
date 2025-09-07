import React, { createContext, useContext, useState } from "react";
import { UserInterface } from "@/lib/FrontendTypes";

interface AuthUserContextTypes {
  authUser: UserInterface | null;
  setAuthUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
}
const AuthUserContext = createContext<AuthUserContextTypes | undefined>(
  undefined,
);

const AuthUserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authUser, setAuthUser] = useState<UserInterface | null>(null);
  return (
    <AuthUserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);

  if (context === undefined) {
    throw new Error("useAuthUser must be used within a UserContextProvider");
  }

  return context;
};

export default AuthUserContextProvider;
