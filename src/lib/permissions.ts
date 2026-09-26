export type UserRole =
  "super_admin" | "state_manager" | "lead_executive" | "verifier" | "approver" | "auditor";

export const currentRole: UserRole = "lead_executive";
