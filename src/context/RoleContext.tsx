import { createContext, useContext } from "react";

export type UserRole =
  | "super_admin"
  | "state_manager"
  | "district_manager"
  | "lead_executive"
  | "verification_officer"
  | "approver"
  | "auditor"
  | "distributor";

interface RoleContextType {
  role: UserRole;
}

const RoleContext = createContext<RoleContextType>({
  role: "lead_executive", // Change this later after Supabase login
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  return (
    <RoleContext.Provider
      value={{
        role: "lead_executive",
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
