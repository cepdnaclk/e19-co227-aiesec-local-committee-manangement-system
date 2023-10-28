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

interface PrivilegesType {
  isSuperUser: boolean;
  isIGVAdmin: boolean;
  isIGVUser: boolean;
  isPMAdmin: boolean;
  isPMUser: boolean;
  isOGVAdmin: boolean;
  isOGVUser: boolean;
  isOGTAdmin: boolean;
  isOGTUser: boolean;
  isFNLAdmin: boolean;
  isFNLUser: boolean;
}

const defaultPrivileges: PrivilegesType = {
  isSuperUser: false,
  isIGVAdmin: false,
  isIGVUser: false,
  isPMAdmin: false,
  isPMUser: false,
  isOGVAdmin: false,
  isOGVUser: false,
  isOGTAdmin: false,
  isOGTUser: false,
  isFNLAdmin: false,
  isFNLUser: false,
};

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType) => void;
  privileges: PrivilegesType;
}

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  privileges: defaultPrivileges,
});

// Retrieve user state from local storage at mount
const getUser = (): UserType | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(getUser);
  const [privileges, setPrivileges] =
    useState<PrivilegesType>(defaultPrivileges);

  // Save user state to local storage when mutated
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));

    // define privileges
    setPrivileges({
      isSuperUser: user?.roleId === "LCP",
      isIGVAdmin:
        user?.roleId === "LCP" ||
        (user?.frontOfficeId === "iGV" && user?.roleId === "LCVP"),
      isIGVUser: user?.frontOfficeId === "LCP" || user?.frontOfficeId === "iGV",
      isPMAdmin:
        user?.roleId === "LCP" ||
        (user?.backOfficeId === "PM" && user?.roleId === "LCVP"),
      isPMUser: user?.frontOfficeId === "LCP" || user?.backOfficeId === "PM",
      isOGVAdmin:
        user?.roleId === "LCP" ||
        (user?.frontOfficeId === "oGV" && user?.roleId === "LCVP"),
      isOGVUser: user?.frontOfficeId === "LCP" || user?.frontOfficeId === "oGV",
      isOGTAdmin:
        user?.roleId === "LCP" ||
        (user?.frontOfficeId === "oGT" && user?.roleId === "LCVP"),
      isOGTUser: user?.frontOfficeId === "LCP" || user?.frontOfficeId === "oGT",
      isFNLAdmin:
        user?.roleId === "LCP" ||
        (user?.backOfficeId === "FnL" && user?.roleId === "LCVP"),
      isFNLUser: user?.frontOfficeId === "LCP" || user?.backOfficeId === "FnL",
    });
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        privileges,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
