import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/leadhub-ui";
import { ROLE_LABELS, type AppRole } from "@/hooks/useAuth";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

export function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("super_admin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/dashboard" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name || email.split("@")[0], role },
          },
        });
        if (error) throw error;
        if (!data.session)
          setMessage("Account created. Check your email to confirm, then sign in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError("Google sign-in failed. Please try again.");
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 lg:flex">
        <Logo />
        <div>
          <h2 className="max-w-md text-[32px] font-bold leading-tight">
            Distributor, retailer and CSP onboarding in one controlled workflow.
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Lead capture, document verification, due diligence, territory capacity, approvals and
            immutable appointment letters — with a full audit trail.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={15} /> Role-based access · MFA ready · Audited
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-panel">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-4 text-2xl font-bold">
            {mode === "signin" ? "Sign in to LeadHub" : "Create your LeadHub account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Use your work email to continue."
              : "Pick the role you want to work as."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold">Full name</span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ananya Sharma"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-2 block text-xs font-semibold">Work email</span>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold">Password</span>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
              {mode === "signin" && (
                <Link
                  to="/forgot-password"
                  className="mt-2 block text-right text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </label>
            {mode === "signup" && (
              <label className="block">
                <span className="mb-2 block text-xs font-semibold">Role</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AppRole)}
                  className="h-9 w-full rounded-md border bg-surface px-3 text-sm"
                >
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {error && (
              <div className="rounded-md border border-error/30 bg-error-soft px-3 py-2 text-xs text-error">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-md border border-success/30 bg-success-soft px-3 py-2 text-xs text-success">
                {message}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full" onClick={google}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New to LeadHub?" : "Already have an account?"}{" "}
            <button
              className="font-semibold text-primary hover:underline"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setMessage(null);
              }}
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (result.error) setError(result.error.message);
    else setMessage("Check your email for the secure password reset link.");
    setBusy(false);
  }
  return (
    <AuthFrame
      title="Reset your password"
      detail="We’ll send a secure recovery link to your work email."
    >
      <Button asChild variant="ghost" className="mb-5 -ml-3">
        <Link to="/login">
          <ArrowLeft />
          Back to sign in
        </Link>
      </Button>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold">Work email</span>
          <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {error && <div className="rounded-md bg-error-soft p-3 text-xs text-error">{error}</div>}
        {message && (
          <div className="rounded-md bg-success-soft p-3 text-xs text-success">{message}</div>
        )}
        <Button className="w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />}Send recovery link
        </Button>
      </form>
    </AuthFrame>
  );
}

export function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    setReady(hash.get("type") === "recovery" || Boolean(hash.get("access_token")));
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    const result = await supabase.auth.updateUser({ password });
    if (result.error) setMessage(result.error.message);
    else {
      setMessage("Password updated. Redirecting…");
      setTimeout(() => void navigate({ to: "/dashboard" }), 800);
    }
  }
  return (
    <AuthFrame
      title="Choose a new password"
      detail="Set a strong password for your LeadHub account."
    >
      {!ready && (
        <div className="mb-4 rounded-md bg-warning-soft p-3 text-xs text-warning">
          Open this page from the recovery link in your email.
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold">New password</span>
          <Input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold">Confirm password</span>
          <Input
            required
            type="password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
        {message && <div className="rounded-md bg-secondary p-3 text-xs">{message}</div>}
        <Button className="w-full" disabled={!ready}>
          Update password
        </Button>
      </form>
    </AuthFrame>
  );
}

function AuthFrame({
  title,
  detail,
  children,
}: {
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8 shadow-panel">
        <Logo />
        <h1 className="mt-8 text-2xl font-bold">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{detail}</p>
        {children}
      </Card>
    </div>
  );
}
