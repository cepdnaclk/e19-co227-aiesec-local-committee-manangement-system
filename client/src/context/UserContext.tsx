import React, { createContext, useState, useEffect } from "react";

type FrontOfficeIdType = "LCP" | "iGV" | "oGV" | "iGT" | "oGT" | "BOVP";
type BackOfficeIdType = "BND" | "FnL" | "BD" | "PM" | "IM" | "EM" | "PnE";
type DepartmentIdType =
  | "LCP"
  | "VP"
  | "IR"
  | "M"
  | "B2B"
  | "VD"
  | "MKT"
  | "B2C"
  | "CXP";
type RoleIdType = "LCP" | "LCVP" | "MGR" | "SPL" | "TL" | "TM" | "CDN";

interface UserType {
  id: string;
  email: string;
  preferredName: string;
  frontOfficeId: FrontOfficeIdType | null;
  backOfficeId: BackOfficeIdType | null;
  departmentId: DepartmentIdType;
  roleId: RoleIdType;
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType) => void;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

// Retrieve user state from local storage at mount
const getUser = (): UserType | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(getUser);

  // Save user state to local storage when mutated
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
