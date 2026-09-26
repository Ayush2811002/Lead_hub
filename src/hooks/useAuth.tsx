import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole =
  | "super_admin"
  | "state_manager"
  | "district_manager"
  | "lead_executive"
  | "verification_officer"
  | "approver"
  | "letter_issuer"
  | "auditor";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  state_manager: "State Manager",
  district_manager: "District Manager",
  lead_executive: "Lead Executive",
  verification_officer: "Verification Officer",
  approver: "Approver",
  letter_issuer: "Letter Issuer",
  auditor: "Auditor",
};

export type Permission =
  | "lead.create"
  | "lead.edit"
  | "lead.delete"
  | "document.upload"
  | "document.download"
  | "verify"
  | "diligence"
  | "approve"
  | "letter.issue"
  | "capacity.edit"
  | "export"
  | "admin"
  | "reports"
  | "audit";

const ALL: Permission[] = [
  "lead.create",
  "lead.edit",
  "lead.delete",
  "document.upload",
  "document.download",
  "verify",
  "diligence",
  "approve",
  "letter.issue",
  "capacity.edit",
  "export",
  "admin",
  "reports",
  "audit",
];

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  super_admin: ALL,
  state_manager: ["lead.edit", "document.download", "export", "reports"],
  district_manager: ["lead.create", "lead.edit", "document.upload", "document.download", "reports"],
  lead_executive: ["lead.create", "lead.edit", "document.upload"],
  verification_officer: ["verify", "diligence", "document.download", "document.upload", "reports"],
  approver: ["approve", "document.download", "reports"],
  letter_issuer: ["letter.issue", "document.download", "reports"],
  auditor: ["reports", "audit", "export"],
};

type Profile = {
  id: string;
  full_name: string;
  email: string | null;
  assigned_state: string | null;
  assigned_district: string | null;
  // role: AppRole;
};

type AuthValue = {
  loading: boolean;
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  activeRole: AppRole;
  setActiveRole: (r: AppRole) => void;
  can: (p: Permission) => boolean;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [activeRole, setActiveRoleState] = useState<AppRole>("super_admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) {
        setProfile(null);
        setRoles([]);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const uid = session?.user.id;
    if (!uid) return;
    let cancelled = false;
    (async () => {
      // const [{ data: p }, { data: r }] = await Promise.all([
      //   supabase.from("profiles").select("id, full_name, email, assigned_state, assigned_district").eq("id", uid).maybeSingle(),
      //   supabase.from("user_roles").select("role").eq("user_id", uid),
      // ]);
      // if (cancelled) return;
      // setProfile((p as Profile) ?? null);
      // const list = ((r ?? []).map((x: { role: string }) => x.role) as AppRole[]);
      // setRoles(list);
      // const stored = typeof window !== "undefined" ? (localStorage.getItem("leadhub.activeRole") as AppRole | null) : null;
      // setActiveRoleState(stored ?? list[0] ?? "lead_executive");

      // const { data: p, error } = await supabase
      //   .from("users")
      //   .select("id, full_name, email, assigned_state, assigned_district, role")
      //   .eq("id", uid)
      //   .single();
      const [{ data: profile }, { data: roleData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, assigned_state, assigned_district")
          .eq("id", uid)
          .single(),

        supabase.from("user_roles").select("role").eq("user_id", uid),
      ]);

      if (cancelled || !profile) return;

      const userRoles: AppRole[] = (roleData ?? []).map((r) => r.role as AppRole);

      // setProfile(profile as Profile);
      // setRoles(userRoles);
      setProfile(profile);
      setRoles(userRoles);

      // setActiveRoleState(userRoles[0] ?? "lead_executive");
      const primaryRole: AppRole = userRoles.length > 0 ? userRoles[0]! : "lead_executive";

      setActiveRoleState(primaryRole);
      // if (cancelled || error || !p) return;

      // setProfile(p as Profile);
      // setRoles([p.role as AppRole]);
      // setActiveRoleState(p.role as AppRole);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const setActiveRole = useCallback((r: AppRole) => {
    setActiveRoleState(r);
    if (typeof window !== "undefined") localStorage.setItem("leadhub.activeRole", r);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      roles,
      activeRole,
      setActiveRole,
      can: (p) => (ROLE_PERMISSIONS[activeRole] ?? []).includes(p),
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [loading, session, profile, roles, activeRole, setActiveRole],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
