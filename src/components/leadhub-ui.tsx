import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  FolderKanban,
  Gauge,
  Grid2X2,
  HelpCircle,
  Home,
  KeyRound,
  Landmark,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  Map,
  MapPin,
  Menu,
  LogOut,
  MoreHorizontal,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Upload,
  UserCog,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  activities,
  documents,
  leads,
  monthlyLeads,
  stateCoverage,
  territories,
  type LeadStatus,
} from "@/lib/leadhub-data";
import { useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "@/components/leadhub-auth";
import { CommandPalette, NotificationBell, RoleSwitcher } from "@/components/leadhub-features";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    section: "Lead management",
    items: [
      { label: "All leads", icon: Users, to: "/leads" },
      { label: "Create lead", icon: Plus, to: "/leads/new" },
      { label: "Follow-ups", icon: CalendarDays, to: "/follow-ups" },
    ],
  },
  {
    section: "Verification",
    items: [
      { label: "Document review", icon: FileCheck2, to: "/verification" },
      { label: "Due diligence", icon: ClipboardCheck, to: "/due-diligence" },
      { label: "Approval queue", icon: FolderKanban, to: "/approvals" },
    ],
  },
  {
    section: "Territory",
    items: [
      { label: "Coverage map", icon: Map, to: "/territory/map" },
      { label: "Capacity", icon: Gauge, to: "/territory/capacity" },
      { label: "Heatmap & reservations", icon: Grid2X2, to: "/territory/heatmap" },
    ],
  },
  {
    section: "Network",
    items: [
      { label: "Partner directory", icon: Network, to: "/partners" },
      { label: "Partner network", icon: Network, to: "/partners/network" },
      { label: "Generate letter", icon: PenLine, to: "/letters/generate" },
      { label: "Letter register", icon: FileText, to: "/letters" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { label: "Reports & analytics", icon: BarChart3, to: "/reports" },
      { label: "Audit log", icon: Archive, to: "/audit" },
    ],
  },
  {
    section: "Administration",
    items: [
      { label: "Users", icon: UserCog, to: "/admin/users" },
      { label: "Roles & permissions", icon: ShieldCheck, to: "/admin/roles" },
      { label: "Geography masters", icon: MapPin, to: "/admin/geography" },
      { label: "Banks & programs", icon: Landmark, to: "/admin/programs" },
      { label: "Import data", icon: Upload, to: "/import" },
      { label: "Settings", icon: Settings, to: "/settings" },
    ],
  },
];

const pageTitles: Record<string, [string, string]> = {
  dashboard: ["Executive dashboard", "National network performance and pending work"],
  leads: ["Lead management", "Track every application from enquiry to activation"],
  "leads/new": ["Create lead", "Capture a new Distributor, Retailer or CSP application"],
  followups: ["Follow-up calendar", "Calls, meetings and field visits across your team"],
  verification: ["Document verification", "Review submitted evidence against the frozen checklist"],
  diligence: ["Due diligence", "Field inspection and infrastructure assessment"],
  approvals: ["Approval queue", "Review eligible applications and record decisions"],
  territory: ["Territory coverage", "Capacity and availability across the national network"],
  map: ["GIS territory map", "Explore coverage from state to block level"],
  capacity: ["Capacity management", "Configure and monitor program capacity"],
  partners: ["Partner directory", "Active distributors, retailers and CSPs"],
  lettergen: ["Appointment letter generator", "Preview and issue controlled appointment letters"],
  letters: ["Letter register", "Issued, superseded, revoked and expired appointments"],
  reports: ["Reports & analytics", "Performance, aging and coverage intelligence"],
  audit: ["Audit log", "Immutable record of sensitive actions and changes"],
  users: ["User management", "Access, territory scope and account security"],
  roles: ["Roles & permissions", "Granular controls across modules and sensitive actions"],
  geography: ["Geography masters", "Versioned state, district and block hierarchy"],
  programs: ["Banks & programs", "Configurable institutions, programs and checklists"],
  settings: ["Settings", "Organization rules, templates, notifications and security"],
  import: ["Import wizard", "Validate and preview data before committing records"],
  notifications: ["Notifications", "Assignments, reminders and workflow alerts"],
  heatmap: ["Territory heatmap", "Capacity, occupancy and active reservations"],
  partnernetwork: ["Partner network", "Distributor, retailer and CSP reporting hierarchy"],
};

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-brand">
        <Zap size={19} fill="currentColor" />
      </div>
      {!compact && (
        <div>
          <div className="text-[17px] font-bold leading-5 text-foreground">LeadHub</div>
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">
            Network operations
          </div>
        </div>
      )}
    </div>
  );
}

function Sidebar({
  collapsed,
  mobile,
  close,
}: {
  collapsed: boolean;
  mobile?: boolean;
  close?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
        collapsed && !mobile ? "w-[76px]" : "w-[280px]",
      )}
    >
      <div className="flex h-[72px] items-center justify-between border-b border-sidebar-border px-5">
        <Logo compact={collapsed && !mobile} />
        {mobile && (
          <Button size="icon" variant="ghost" aria-label="Close navigation" onClick={close}>
            <X />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((group, i) =>
          group.to ? (
            <NavLink
              key={group.label}
              {...group}
              pathname={pathname}
              collapsed={collapsed && !mobile}
              close={close}
            />
          ) : (
            <div key={group.section} className="mt-5 first:mt-0">
              {!collapsed || mobile ? (
                <div className="mb-2 px-3 text-[10px] font-semibold uppercase text-sidebar-muted">
                  {group.section}
                </div>
              ) : (
                <div className="mx-3 mb-2 border-t border-sidebar-border" />
              )}
              <div className="space-y-1">
                {group.items?.map((item) => (
                  <NavLink
                    key={item.label}
                    {...item}
                    pathname={pathname}
                    collapsed={collapsed && !mobile}
                    close={close}
                  />
                ))}
              </div>
            </div>
          ),
        )}
      </div>
      <div className="border-t border-sidebar-border p-3">
        <ProfileMenu compact={collapsed && !mobile} />
      </div>
    </aside>
  );
}

function ProfileMenu({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const { user, profile, activeRole, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const name =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function logout() {
    setOpen(false);
    await signOut();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-sidebar-accent",
          compact && "justify-center",
        )}
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
          {initials}
        </div>
        {!compact && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {activeRole.replaceAll("_", " ")}
            </div>
          </div>
        )}
        {!compact && <MoreHorizontal className="text-muted-foreground" size={18} />}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute bottom-full left-0 z-50 mb-2 w-64 rounded-lg border bg-surface p-2 shadow-modal",
            compact && "left-full bottom-0 ml-2",
          )}
        >
          <div className="border-b px-3 pb-2">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void navigate({ to: "/settings" });
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
          >
            <CircleUserRound size={16} />
            Profile and settings
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => void logout()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-error hover:bg-error-soft"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function NavLink({ label, icon: Icon, to, pathname, collapsed, close }: any) {
  const active = pathname === to || (to !== "/dashboard" && pathname.startsWith(to + "/"));
  return (
    <Link
      to={to}
      onClick={close}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
        active && "bg-sidebar-accent text-primary",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
      {active && !collapsed && <span className="ml-auto h-4 w-0.5 rounded bg-primary" />}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const [commands, setCommands] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { loading, user } = useAuth();
  const authPage =
    pathname === "/login" || pathname === "/forgot-password" || pathname === "/reset-password";
  if (authPage) return <>{children}</>;
  if (loading)
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground">
        Loading LeadHub…
      </div>
    );
  if (!user) return <AuthScreen />;
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} />
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar collapsed={false} mobile close={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="grid h-[72px] shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b bg-surface px-4 sm:px-6">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Toggle navigation"
            onClick={() =>
              window.innerWidth < 1024 ? setMobileOpen(true) : setCollapsed(!collapsed)
            }
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose className="hidden lg:block" />}
            <Menu className="lg:hidden" />
          </Button>
          <button
            onClick={() => setCommands(true)}
            className="relative hidden h-10 max-w-[520px] items-center rounded-md bg-secondary pl-10 pr-14 text-left text-sm text-muted-foreground md:flex"
          >
            <Search className="absolute left-3" size={17} />
            Search leads, partners, letters…<kbd className="absolute right-3 text-xs">⌘ K</kbd>
          </button>
          <div className="flex items-center justify-end gap-2">
            <Button className="hidden sm:inline-flex" onClick={() => setNotice(true)}>
              <Plus />
              Quick create
            </Button>
            <RoleSwitcher />
            <NotificationBell />
            <Button size="icon" variant="ghost" aria-label="Help">
              <HelpCircle />
            </Button>
            <ProfileMenu compact />
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      {notice && (
        <Toast
          title="Quick create ready"
          detail="Choose Create lead from the navigation to begin."
          close={() => setNotice(false)}
        />
      )}
      <CommandPalette open={commands} setOpen={setCommands} />
    </div>
  );
}

export function Page({
  pageKey,
  actions,
  children,
}: {
  pageKey: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const title = pageTitles[pageKey] || ["LeadHub", "Enterprise network operations"];
  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 grid grid-cols-1 items-end gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            LeadHub <ChevronRight className="inline size-3" /> {title[0]}
          </div>
          <h1 className="text-2xl font-bold sm:text-[32px]">{title[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{title[1]}</p>
        </div>
        {actions && <div className="justify-self-start sm:justify-self-auto">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold",
        `status-${key}`,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function Kpi({ label, value, change, icon: Icon, tone = "primary" }: any) {
  return (
    <Card className="p-5 shadow-panel transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={cn("grid size-10 place-items-center rounded-xl", `metric-${tone}`)}>
          <Icon size={19} />
        </div>
        <span
          className={cn(
            "flex items-center text-xs font-semibold",
            change.startsWith("+") ? "text-success" : "text-warning",
          )}
        >
          {change.startsWith("+") ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{" "}
          {change}
        </span>
      </div>
      <div className="mt-4 text-[28px] font-bold">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}

const chartTooltip = {
  borderRadius: 10,
  border: "1px solid var(--border)",
  boxShadow: "var(--shadow-panel)",
  fontSize: 12,
};

export function Dashboard() {
  const donut = [
    { name: "Verification", value: 31 },
    { name: "Submitted", value: 24 },
    { name: "Approved", value: 27 },
    { name: "Correction", value: 18 },
  ];
  return (
    <Page
      pageKey="dashboard"
      actions={
        <Button>
          <Plus />
          New lead
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total leads" value="12,648" change="+12.4%" icon={Users} />
        <Kpi
          label="Pending verification"
          value="386"
          change="-4.2%"
          icon={FileCheck2}
          tone="warning"
        />
        <Kpi
          label="Approved partners"
          value="4,892"
          change="+8.7%"
          icon={CheckCircle2}
          tone="success"
        />
        <Kpi label="Vacant territories" value="1,284" change="+2.1%" icon={MapPin} tone="info" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <Panel title="Monthly lead trend" subtitle="Leads created and approved">
          <div className="h-[285px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyLeads} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip contentStyle={chartTooltip} />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="var(--success)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              ["Leads", "primary"],
              ["Approved", "success"],
            ]}
          />
        </Panel>
        <Panel title="Lead status" subtitle="Current pipeline distribution">
          <div className="relative h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  dataKey="value"
                  innerRadius={66}
                  outerRadius={92}
                  paddingAngle={3}
                >
                  {["var(--primary)", "var(--info)", "var(--success)", "var(--warning)"].map(
                    (c) => (
                      <Cell key={c} fill={c} />
                    ),
                  )}
                </Pie>
                <Tooltip contentStyle={chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-2xl font-bold">1,248</div>
                <div className="text-xs text-muted-foreground">Open leads</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {donut.map((x, i) => (
              <div className="flex items-center justify-between text-xs" key={x.name}>
                <span className="text-muted-foreground">
                  <span
                    className="mr-2 inline-block size-2 rounded-full"
                    style={{
                      background: [
                        "var(--primary)",
                        "var(--info)",
                        "var(--success)",
                        "var(--warning)",
                      ][i],
                    }}
                  />
                  {x.name}
                </span>
                <b>{x.value}%</b>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel
          title="State-wise coverage"
          subtitle="Filled eligible blocks / open configured blocks"
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateCoverage} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="state"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  tick={{ fill: "var(--foreground)", fontSize: 12 }}
                />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="coverage" fill="var(--primary)" radius={[0, 5, 5, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          title="Recent activity"
          subtitle="Across your assigned network"
          action="View audit log"
        >
          <Timeline compact />
        </Panel>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <QueueCard
          title="Overdue follow-ups"
          count="24"
          detail="8 high priority"
          icon={Clock3}
          tone="warning"
        />
        <QueueCard
          title="Expiring documents"
          count="17"
          detail="Within next 7 days"
          icon={AlertTriangle}
          tone="error"
        />
        <QueueCard
          title="Pending approvals"
          count="39"
          detail="6 waiting over 48 hours"
          icon={ClipboardCheck}
          tone="info"
        />
      </div>
    </Page>
  );
}

function Panel({ title, subtitle, action, children, className }: any) {
  return (
    <Card className={cn("p-5 shadow-panel", className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && (
          <Button variant="ghost" size="sm">
            {action}
            <ArrowRight />
          </Button>
        )}
      </div>
      {children}
    </Card>
  );
}
function ChartLegend({ items }: any) {
  return (
    <div className="flex justify-center gap-5">
      {items.map(([x, t]: any) => (
        <span key={x} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={cn("size-2 rounded-full", `bg-${t}`)} />
          {x}
        </span>
      ))}
    </div>
  );
}
function QueueCard({ title, count, detail, icon: Icon, tone }: any) {
  return (
    <Card className="flex items-center gap-4 p-5 shadow-panel">
      <div className={cn("grid size-11 place-items-center rounded-xl", `metric-${tone}`)}>
        <Icon />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>
      <div className="text-2xl font-bold">{count}</div>
      <ChevronRight className="text-muted-foreground" />
    </Card>
  );
}

export function LeadsList() {
  const [query, setQuery] = useState("");
  const filtered = leads.filter((l) =>
    `${l.name} ${l.id} ${l.district}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Page
      pageKey="leads"
      actions={
        <Button asChild>
          <Link to="/leads/new">
            <Plus />
            Create lead
          </Link>
        </Button>
      }
    >
      <FilterBar query={query} setQuery={setQuery} />
      <Card className="mt-4 overflow-hidden shadow-panel">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-secondary text-xs text-muted-foreground">
              <tr>
                {[
                  "Lead / Applicant",
                  "Type & Program",
                  "Mobile",
                  "District",
                  "Owner",
                  "Status",
                  "Follow-up",
                  "",
                ].map((x) => (
                  <th className="whitespace-nowrap px-5 py-3 font-semibold" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-t transition-colors hover:bg-secondary/60">
                  <td className="px-5 py-4">
                    <Link
                      to="/leads/$leadId"
                      params={{ leadId: l.id }}
                      className="font-semibold text-primary hover:underline"
                    >
                      {l.id}
                    </Link>
                    <div className="mt-1 font-medium text-foreground">{l.name}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{l.type}</div>
                    <div className="text-xs text-muted-foreground">{l.program}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{l.mobile}</td>
                  <td className="px-5 py-4">
                    <div>{l.district}</div>
                    <div className="text-xs text-muted-foreground">{l.state}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{l.owner}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={l.status} />
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-5 py-4 text-xs",
                      l.followUp.includes("Overdue") && "font-semibold text-error",
                    )}
                  >
                    {l.followUp}
                  </td>
                  <td className="px-5 py-4">
                    <Button size="icon" variant="ghost" aria-label="Lead actions">
                      <MoreHorizontal />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divide-y md:hidden">
          {filtered.map((l) => (
            <Link
              to="/leads/$leadId"
              params={{ leadId: l.id }}
              key={l.id}
              className="block p-4 hover:bg-secondary"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-primary">{l.id}</div>
                  <div className="mt-1 font-semibold">{l.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {l.type} · {l.district}
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>{l.owner}</span>
                <span>{l.followUp}</span>
              </div>
            </Link>
          ))}
        </div>
        <Pagination />
      </Card>
    </Page>
  );
}

function FilterBar({ query, setQuery }: any) {
  return (
    <Card className="p-3 shadow-panel">
      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(4,auto)]">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            placeholder="Search ID, name, mobile or district"
          />
        </div>
        {["State", "District", "Type", "Status"].map((x) => (
          <Button variant="outline" key={x}>
            {x}
            <ChevronDown />
          </Button>
        ))}
        <Button variant="outline">
          <SlidersHorizontal />
          More filters
        </Button>
        <Button variant="outline">
          <Download />
          Export
        </Button>
      </div>
    </Card>
  );
}
function Pagination() {
  return (
    <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
      <span>Showing 1–6 of 12,648 leads</span>
      <div className="flex gap-1">
        <Button size="icon" variant="outline" aria-label="Previous">
          <ChevronLeft />
        </Button>
        <Button size="sm">1</Button>
        <Button size="sm" variant="ghost">
          2
        </Button>
        <Button size="sm" variant="ghost">
          3
        </Button>
        <Button size="icon" variant="outline" aria-label="Next">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function CreateLead() {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(false);
  const steps = ["Applicant", "Residential", "Outlet", "Documents", "Review"];
  return (
    <Page
      pageKey="leads/new"
      actions={
        <Button variant="outline" onClick={() => setToast(true)}>
          Save draft
        </Button>
      }
    >
      <Card className="mb-6 overflow-hidden p-5 shadow-panel">
        <div className="flex min-w-max items-center justify-between gap-3 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <button onClick={() => setStep(i + 1)} className="flex items-center gap-2 text-left">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold",
                    step === i + 1
                      ? "border-primary bg-primary text-primary-foreground"
                      : step > i + 1
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-surface text-muted-foreground",
                  )}
                >
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-semibold sm:block",
                    step === i + 1 ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {s}
                </span>
              </button>
              {i < 4 && (
                <div
                  className={cn(
                    "mx-3 h-px min-w-8 flex-1",
                    step > i + 1 ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-6 shadow-panel">
          <StepContent step={step} />
          <div className="mt-8 flex justify-between border-t pt-5">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
              <ArrowLeft />
              Back
            </Button>
            <Button onClick={() => (step < 5 ? setStep(step + 1) : setToast(true))}>
              {step === 5 ? "Submit for verification" : "Continue"}
              <ArrowRight />
            </Button>
          </div>
        </Card>
        <div className="space-y-4">
          <Panel title="Application progress" subtitle="Required before submission">
            <div className="mb-2 flex justify-between text-xs">
              <span>Completion</span>
              <b>{step * 20}%</b>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${step * 20}%` }}
              />
            </div>
          </Panel>
          <Panel title="Submission checklist">
            <div className="space-y-3">
              {[
                "Applicant details",
                "Contact verified",
                "Outlet GPS",
                "Required documents",
                "Consent captured",
              ].map((x, i) => (
                <div key={x} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full",
                      i < step
                        ? "bg-success-soft text-success"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {i < step ? <Check size={12} /> : i + 1}
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
      {toast && (
        <Toast
          title={step === 5 ? "Lead submitted" : "Draft saved"}
          detail={
            step === 5
              ? "LD-2026-01843 is ready for verification."
              : "Your progress has been saved securely."
          }
          close={() => setToast(false)}
        />
      )}
    </Page>
  );
}

function Field({ label, placeholder, required = true, type = "text" }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold">
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </span>
      <Input type={type} placeholder={placeholder} />
    </label>
  );
}
function SelectField({ label, value }: any) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold">
        {label}
        <span className="ml-1 text-error">*</span>
      </span>
      <button className="flex h-9 w-full items-center justify-between rounded-md border bg-surface px-3 text-sm">
        <span>{value}</span>
        <ChevronDown size={15} />
      </button>
    </label>
  );
}
function StepContent({ step }: any) {
  if (step === 1)
    return (
      <div>
        <SectionTitle
          title="Applicant information"
          detail="Minimum identity and contact details for lead creation"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" placeholder="Enter applicant name" />
          <Field label="Father's name" placeholder="Enter father's name" />
          <Field label="Date of birth" type="date" />
          <SelectField label="Gender" value="Select gender" />
          <SelectField label="Entity type" value="Individual" />
          <Field label="Primary mobile" placeholder="10-digit mobile number" />
          <Field label="Email address" placeholder="name@company.com" />
          <SelectField label="Application type" value="Distributor" />
        </div>
      </div>
    );
  if (step === 2)
    return (
      <div>
        <SectionTitle
          title="Residential address"
          detail="Keep this separate from the proposed outlet address"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Address lines" placeholder="House number, street and landmark" />
          </div>
          <SelectField label="State" value="Uttar Pradesh" />
          <SelectField label="District" value="Lucknow" />
          <SelectField label="Block / Urban unit" value="Mohanlalganj" />
          <Field label="Village / Town" placeholder="Enter village or town" />
          <Field label="Post office" placeholder="Enter post office" />
          <Field label="PIN code" placeholder="6-digit PIN" />
        </div>
      </div>
    );
  if (step === 3)
    return (
      <div>
        <SectionTitle
          title="Proposed outlet"
          detail="Capture a verifiable business location and supporting evidence"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <Field label="Shop name" placeholder="Enter business or outlet name" />
            <Field label="Outlet address" placeholder="Street, landmark and locality" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude" placeholder="26.846694" />
              <Field label="Longitude" placeholder="80.946166" />
            </div>
            <Button>
              <MapPin />
              Capture current GPS
            </Button>
            <p className="text-xs text-muted-foreground">
              Accuracy will be recorded with capture method, operator and timestamp.
            </p>
          </div>
          <MapMock />
        </div>
      </div>
    );
  if (step === 4)
    return (
      <div>
        <SectionTitle
          title="Required documents"
          detail="PDF, JPG or PNG · Maximum 10 MB each · New versions require review"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "PAN Card",
            "Aadhaar / Identity Proof",
            "Applicant Photograph",
            "Police Verification",
            "Bank Application Form",
            "Outlet Exterior Photo",
          ].map((x, i) => (
            <div
              key={x}
              className="rounded-xl border border-dashed p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Upload />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{x}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {i < 3 ? "Uploaded · Security scan complete" : "Drop file or browse"}
                  </div>
                  {i < 3 && (
                    <div className="mt-3 h-1.5 rounded-full bg-secondary">
                      <div className="h-full w-full rounded-full bg-success" />
                    </div>
                  )}
                </div>
                {i < 3 && <CheckCircle2 className="text-success" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div>
      <SectionTitle
        title="Review and submit"
        detail="Confirm all information before freezing this version for review"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["Applicant", "Aarav Sharma", "Distributor · Individual"],
          ["Residential", "Mohanlalganj, Lucknow", "Uttar Pradesh · 226301"],
          ["Outlet", "Sharma Digital Services", "GPS captured · 9m accuracy"],
          ["Documents", "5 of 5 required uploaded", "All files passed security scan"],
        ].map((x) => (
          <div key={x[0]} className="rounded-xl border p-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{x[0]}</h3>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </div>
            <p className="mt-3 text-sm">{x[1]}</p>
            <p className="mt-1 text-xs text-muted-foreground">{x[2]}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-3 rounded-xl border border-success/30 bg-success-soft p-4">
        <CheckCircle2 className="shrink-0 text-success" />
        <div>
          <div className="text-sm font-semibold">Ready for submission</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Profile, location, consent and configured uploads meet the submission gate.
          </p>
        </div>
      </div>
    </div>
  );
}
function SectionTitle({ title, detail }: any) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
function MapMock() {
  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-xl border bg-map">
      <div className="absolute inset-0 map-grid" />
      <div className="absolute left-[48%] top-[45%] grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-brand">
        <MapPin />
      </div>
      <div className="absolute bottom-3 left-3 rounded-lg border bg-surface p-3 text-xs shadow-panel">
        <b>Mohanlalganj, Lucknow</b>
        <div className="mt-1 text-muted-foreground">26.6843, 80.9787 · 9m accuracy</div>
      </div>
    </div>
  );
}

const detailTabs = [
  "Overview",
  "Applicant",
  "Residential",
  "Outlet",
  "Documents",
  "Due diligence",
  "Follow-ups",
  "Approval",
  "Territory",
  "Letters",
  "Activity",
];
export function LeadDetail() {
  const [tab, setTab] = useState("Overview");
  const lead = leads[0];
  if (!lead) return null;
  return (
    <Page
      pageKey="leads"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <MoreHorizontal />
          </Button>
          <Button>
            <Send />
            Request review
          </Button>
        </div>
      }
    >
      <Card className="p-5 shadow-panel">
        <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-lg font-bold text-primary">
            {lead.initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{lead.name}</h1>
              <StatusBadge status={lead.status} />
              <span className="rounded-md bg-error-soft px-2 py-1 text-xs font-semibold text-error">
                High priority
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>{lead.id}</span>
              <span>{lead.type}</span>
              <span>{lead.program}</span>
              <span>Owner: {lead.owner}</span>
            </div>
          </div>
          <Button variant="outline">
            <CircleUserRound />
            Reassign
          </Button>
        </div>
        <div className="mt-5 overflow-x-auto border-t pt-3">
          <div className="flex min-w-max gap-1">
            {detailTabs.map((x) => (
              <Button
                key={x}
                size="sm"
                variant={tab === x ? "secondary" : "ghost"}
                onClick={() => setTab(x)}
              >
                {x}
              </Button>
            ))}
          </div>
        </div>
      </Card>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <DetailTab tab={tab} />
        <div className="space-y-4">
          <Panel title="Quick actions">
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <CalendarDays />
                Schedule follow-up
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Upload />
                Upload document
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ClipboardCheck />
                Start inspection
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin />
                Reserve territory
              </Button>
            </div>
          </Panel>
          <Panel title="Workflow health">
            <div className="space-y-3 text-xs">
              <Health label="Profile complete" ok />
              <Health label="Location verified" ok />
              <Health label="Documents verified" />
              <Health label="Due diligence complete" />
              <Health label="Final approval" />
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
function Health({ label, ok }: any) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="text-success" size={16} />
      ) : (
        <Clock3 className="text-warning" size={16} />
      )}
      <span>{label}</span>
      <span className="ml-auto text-muted-foreground">{ok ? "Complete" : "Pending"}</span>
    </div>
  );
}
function DetailTab({ tab }: any) {
  if (tab === "Documents") return <DocumentGrid />;
  if (tab === "Activity")
    return (
      <Panel title="Activity history" subtitle="Times shown in Asia/Kolkata">
        <Timeline />
      </Panel>
    );
  if (tab === "Outlet")
    return (
      <Panel title="Outlet location">
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoGrid
            items={[
              ["Shop name", "Sharma Digital Services"],
              ["Address", "Raebareli Road, Mohanlalganj"],
              ["Capture method", "Device GPS"],
              ["Accuracy", "9 metres"],
              ["Captured", "18 Sep 2026, 4:22 PM"],
              ["Operator", "Neha Singh"],
            ]}
          />
          <MapMock />
        </div>
      </Panel>
    );
  return (
    <div className="space-y-6">
      <Panel title={tab === "Overview" ? "Application overview" : tab}>
        <InfoGrid
          items={[
            ["Full name", "Aarav Sharma"],
            ["Father's name", "Rajesh Sharma"],
            ["Date of birth", "14 February 1992"],
            ["Entity type", "Individual"],
            ["Primary mobile", "+91 ••••• 4821"],
            ["Email", "aarav.s@example.in"],
            ["State", "Uttar Pradesh"],
            ["District", "Lucknow"],
          ]}
        />
      </Panel>
      {tab === "Overview" && (
        <Panel title="Progress timeline">
          <Timeline />
        </Panel>
      )}
    </div>
  );
}
function InfoGrid({ items }: any) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map(([a, b]: any) => (
        <div key={a}>
          <dt className="text-xs font-medium text-muted-foreground">{a}</dt>
          <dd className="mt-1 text-sm font-medium">{b}</dd>
        </div>
      ))}
    </dl>
  );
}
function Timeline({ compact = false }: any) {
  return (
    <div className="space-y-0">
      {activities.slice(0, compact ? 4 : undefined).map((a, i) => (
        <div key={a.title} className="relative flex gap-3 pb-5 last:pb-0">
          <div
            className={cn(
              "relative z-10 mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
              `metric-${a.tone}`,
            )}
          >
            {i === 0 ? <Check size={13} /> : <Activity size={13} />}
          </div>
          {i < activities.length - 1 && (
            <div className="absolute left-3.5 top-7 h-full w-px bg-border" />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{a.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{a.detail}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {a.user} · {a.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((d) => (
        <Card key={d.name} className="overflow-hidden shadow-panel">
          <div className="grid h-32 place-items-center bg-secondary">
            <FileText size={38} className="text-muted-foreground" />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">{d.name}</div>
                <div className="mt-1 truncate text-xs text-muted-foreground">{d.file}</div>
              </div>
              <StatusBadge status={d.status} />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {d.date} · {d.version}
              </span>
              <Button size="sm" variant="ghost">
                Replace
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function Verification() {
  const [selected, setSelected] = useState(0);
  const document = documents[selected] ?? documents[0];
  if (!document) return null;
  const [toast, setToast] = useState(false);
  return (
    <Page pageKey="verification" actions={<StatusBadge status="Under Review" />}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_420px]">
        <Panel title={document.name} subtitle={`${document.file} · ${document.version}`}>
          <div className="relative grid min-h-[590px] place-items-center overflow-hidden rounded-xl bg-document">
            <div className="absolute left-4 top-4 flex gap-2">
              <Button size="sm" variant="secondary">
                <Search />
                Zoom
              </Button>
              <Button size="sm" variant="secondary">
                <Download />
                Download
              </Button>
            </div>
            <div className="w-[72%] max-w-[480px] bg-surface p-10 shadow-document">
              <div className="h-3 w-28 bg-primary" />
              <div className="mt-8 text-center">
                <div className="text-lg font-bold">INCOME TAX DEPARTMENT</div>
                <div className="mt-1 text-xs text-muted-foreground">GOVT. OF INDIA</div>
              </div>
              <div className="mt-10 grid grid-cols-[80px_1fr] gap-6">
                <div className="h-24 bg-secondary" />
                <div className="space-y-4">
                  <DocLine w="80%" />
                  <DocLine w="62%" />
                  <DocLine w="72%" />
                </div>
              </div>
              <div className="mt-10 h-px bg-border" />
              <div className="mt-8 grid grid-cols-2 gap-6">
                <DocLine w="70%" />
                <DocLine w="88%" />
                <DocLine w="66%" />
                <DocLine w="74%" />
              </div>
            </div>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel
            title="Verification checklist"
            subtitle="Checklist v3.2 · Distributor / Aadhaar Banking"
          >
            <div className="space-y-4">
              {[
                "Document is legible",
                "Name matches application",
                "PAN format is valid",
                "Photograph matches applicant",
                "No visible tampering",
              ].map((x, i) => (
                <label key={x} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <input type="checkbox" defaultChecked={i < 3} className="size-4 accent-primary" />
                  {x}
                </label>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-semibold">Reviewer notes</span>
              <textarea
                className="min-h-24 w-full rounded-lg border bg-surface p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Record findings…"
              />
            </label>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => setToast(true)}>
                Reject
              </Button>
              <Button variant="secondary" onClick={() => setToast(true)}>
                Correction
              </Button>
              <Button onClick={() => setToast(true)}>
                <Check />
                Verify
              </Button>
            </div>
          </Panel>
          <Panel title="Documents">
            <div className="space-y-1">
              {documents.map((d, i) => (
                <button
                  onClick={() => setSelected(i)}
                  key={d.name}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary",
                    selected === i && "bg-secondary",
                  )}
                >
                  <FileText size={16} />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{d.name}</span>
                  <StatusBadge status={d.status} />
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
      {toast && (
        <Toast
          title="Review recorded"
          detail="The document history and application checklist were updated."
          close={() => setToast(false)}
        />
      )}
    </Page>
  );
}
function DocLine({ w }: any) {
  return <div className="h-2 rounded bg-secondary" style={{ width: w }} />;
}

export function CalendarView() {
  const [view, setView] = useState("Month");
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const events: any = {
    3: ["Call · Priya Kumari"],
    7: ["Visit · Aarav Sharma", "Review · Farhan Ali"],
    12: ["Meeting · Vikram Patel"],
    18: ["Call · Sneha Das"],
    21: ["Site visit · LD-01841"],
    25: ["Follow-up · Manoj Yadav"],
  };
  return (
    <Page
      pageKey="followups"
      actions={
        <Button>
          <Plus />
          Create activity
        </Button>
      }
    >
      <Card className="overflow-hidden shadow-panel">
        <div className="grid gap-4 border-b p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
          <div>
            <h2 className="font-semibold">September 2026</h2>
            <p className="text-xs text-muted-foreground">42 scheduled activities</p>
          </div>
          <div className="flex rounded-lg bg-secondary p-1">
            {["Day", "Week", "Month"].map((x) => (
              <Button
                key={x}
                size="sm"
                variant={view === x ? "default" : "ghost"}
                onClick={() => setView(x)}
              >
                {x}
              </Button>
            ))}
          </div>
          <div className="flex">
            <Button size="icon" variant="outline">
              <ChevronLeft />
            </Button>
            <Button variant="ghost">Today</Button>
            <Button size="icon" variant="outline">
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b bg-secondary text-center text-xs font-semibold text-muted-foreground">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => (
            <div className="py-3" key={x}>
              {x}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => (
            <div
              key={i}
              className={cn(
                "min-h-28 border-b border-r p-2",
                d < 1 && "bg-secondary/50 text-muted-foreground",
              )}
            >
              <div className="text-xs font-semibold">{d < 1 ? 29 + d : d}</div>
              {events[d]?.map((e: string, j: number) => (
                <div
                  key={e}
                  className={cn(
                    "mt-2 rounded-md border-l-2 bg-primary-soft px-2 py-1.5 text-[11px] font-medium text-primary",
                    j && "border-info bg-info-soft text-info",
                  )}
                >
                  {e}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

export function ApprovalQueue() {
  const [drawer, setDrawer] = useState(false);
  const cols = ["Pending", "Under Review", "Correction", "Approved"];
  return (
    <Page
      pageKey="approvals"
      actions={
        <Button variant="outline">
          <Filter />
          Filter
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-4">
        {cols.map((col, ci) => (
          <div key={col}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{col}</h2>
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                {[8, 5, 3, 12][ci]}
              </span>
            </div>
            <div className="space-y-3">
              {leads.slice(ci, ci + 3).map((l, i) => (
                <Card
                  key={l.id}
                  onClick={() => setDrawer(true)}
                  className="cursor-pointer p-4 shadow-panel transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{l.id}</span>
                    <span>{i + 1}d in stage</span>
                  </div>
                  <div className="mt-2 font-semibold">{l.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {l.type} · {l.district}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs">{l.owner}</span>
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        ci === 3 ? "bg-success" : ci === 2 ? "bg-warning" : "bg-primary",
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      {drawer && (
        <SideDrawer close={() => setDrawer(false)} title="Approval review">
          <div className="space-y-5">
            <div>
              <div className="text-xs text-muted-foreground">LD-2026-01842</div>
              <h2 className="mt-1 text-xl font-semibold">Aarav Sharma</h2>
              <div className="mt-2">
                <StatusBadge status="Verification" />
              </div>
            </div>
            <Panel title="Approval gates">
              <div className="space-y-3">
                <Health label="Identity verified" ok />
                <Health label="Documents verified" ok />
                <Health label="Due diligence passed" ok />
                <Health label="Bank approval recorded" />
                <Health label="Territory capacity available" ok />
              </div>
            </Panel>
            <div className="rounded-xl border border-warning/30 bg-warning-soft p-4 text-xs">
              <b>Separation of duties</b>
              <p className="mt-1 text-muted-foreground">
                You did not create this lead and are eligible to record a final decision.
              </p>
            </div>
            <label>
              <span className="mb-2 block text-xs font-semibold">Decision reason</span>
              <textarea className="min-h-24 w-full rounded-lg border p-3 text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">Request correction</Button>
              <Button disabled>Approve application</Button>
            </div>
          </div>
        </SideDrawer>
      )}
    </Page>
  );
}

export function Territory({ mode = "coverage" }: { mode?: string }) {
  if (mode === "map") return <MapScreen />;
  return (
    <Page
      pageKey={mode === "capacity" ? "capacity" : "territory"}
      actions={
        <Button variant="outline">
          <Download />
          Export
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Open blocks" value="6,482" change="+1.2%" icon={Map} />
        <Kpi label="Filled" value="4,018" change="+6.4%" icon={CheckCircle2} tone="success" />
        <Kpi label="Reserved" value="386" change="+2.0%" icon={Clock3} tone="warning" />
        <Kpi label="Available capacity" value="2,078" change="-3.1%" icon={Gauge} tone="info" />
      </div>
      <Card className="mt-6 overflow-hidden shadow-panel">
        <div className="flex flex-wrap justify-between gap-3 border-b p-4">
          <div className="relative min-w-56">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input className="pl-9" placeholder="Search geography" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Program
              <ChevronDown />
            </Button>
            <Button variant="outline">
              Partner type
              <ChevronDown />
            </Button>
            {mode === "capacity" && (
              <Button>
                <PenLine />
                Edit capacity
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs text-muted-foreground">
              <tr>
                {[
                  "State / District",
                  "Block",
                  "Capacity",
                  "Occupied",
                  "Reserved",
                  "Available",
                  "Status",
                  "Pending leads",
                ].map((x) => (
                  <th key={x} className="px-5 py-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {territories.map((t) => (
                <tr key={t.block} className="border-t hover:bg-secondary/50">
                  <td className="px-5 py-4">
                    <b>{t.state}</b>
                    <div className="text-xs text-muted-foreground">{t.district}</div>
                  </td>
                  <td className="px-5 py-4 font-medium">{t.block}</td>
                  <td className="px-5 py-4">
                    {mode === "capacity" ? (
                      <Input className="w-20" defaultValue={t.capacity} />
                    ) : (
                      t.capacity
                    )}
                  </td>
                  <td className="px-5 py-4">{t.occupied}</td>
                  <td className="px-5 py-4">{t.reserved}</td>
                  <td className="px-5 py-4 font-semibold">
                    {Math.max(0, t.capacity - t.occupied - t.reserved)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-4">{t.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}
function MapScreen() {
  const [selected, setSelected] = useState(territories[0]);
  if (!selected) return null;
  return (
    <Page
      pageKey="map"
      actions={
        <Button variant="outline">
          <ListFilter />
          Filters
        </Button>
      }
    >
      <Card className="overflow-hidden shadow-panel">
        <div className="grid min-h-[680px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative overflow-hidden bg-map">
            <div className="absolute inset-0 map-grid" />
            <div className="absolute left-5 top-5 z-10 flex gap-2">
              <Button variant="secondary">
                India
                <ChevronRight />
                Uttar Pradesh
                <ChevronRight />
                Lucknow
              </Button>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <IndiaMap />
            </div>
            <div className="absolute bottom-5 left-5 flex flex-wrap gap-3 rounded-xl border bg-surface p-3 text-xs shadow-panel">
              {[
                ["Vacant", "success"],
                ["Reserved", "warning"],
                ["Partial", "primary"],
                ["Filled", "error"],
              ].map(([a, b]) => (
                <span key={a} className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-sm", `bg-${b}`)} />
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div className="border-l p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Selected block</div>
                <h2 className="mt-1 text-xl font-semibold">{selected.block}</h2>
                <p className="text-xs text-muted-foreground">
                  {selected.district}, {selected.state}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ["Capacity", selected.capacity],
                ["Occupied", selected.occupied],
                ["Reserved", selected.reserved],
                [
                  "Available",
                  Math.max(0, selected.capacity - selected.occupied - selected.reserved),
                ],
              ].map((x) => (
                <div key={x[0]} className="rounded-lg bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">{x[0]}</div>
                  <div className="mt-1 text-xl font-bold">{x[1]}</div>
                </div>
              ))}
            </div>
            <h3 className="mt-6 text-sm font-semibold">Nearby blocks</h3>
            <div className="mt-2 space-y-1">
              {territories.map((t) => (
                <button
                  key={t.block}
                  onClick={() => setSelected(t)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg p-3 text-left text-sm hover:bg-secondary",
                    selected.block === t.block && "bg-primary-soft text-primary",
                  )}
                >
                  <span>
                    {t.block}
                    <span className="mt-0.5 block text-xs text-muted-foreground">{t.district}</span>
                  </span>
                  <StatusBadge status={t.status} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Page>
  );
}
function IndiaMap() {
  return (
    <div className="relative h-[510px] w-[390px] max-w-[80%]">
      <svg
        viewBox="0 0 400 520"
        className="h-full w-full drop-shadow-sm"
        aria-label="Simplified India territory map"
      >
        <path
          d="M102 27l56 18 39-12 38 28 54 8 27 43-22 37 20 34-26 39-10 59-35 42-9 63-37 92-22-53-41-29-10-58-41-43 9-58-33-44 24-42-8-47 38-31z"
          fill="var(--map-land)"
          stroke="var(--surface)"
          strokeWidth="4"
        />
        <path d="M235 61l81 14 49 35-46 21-29-18" fill="var(--warning)" opacity=".75" />
        <path d="M99 123l73-28 55 32-16 64-83 7" fill="var(--success)" opacity=".8" />
        <path d="M128 201l83-7 57 37-22 69-97-11" fill="var(--primary)" opacity=".72" />
        <path d="M150 294l94 10-11 78-57 43-40-58" fill="var(--error)" opacity=".68" />
      </svg>
      {[
        ["28%", "25%", "success"],
        ["57%", "32%", "warning"],
        ["47%", "51%", "primary"],
        ["48%", "71%", "error"],
      ].map((x, i) => (
        <span
          key={i}
          className={cn(
            "absolute grid size-5 place-items-center rounded-full border-2 border-surface shadow",
            `bg-${x[2]}`,
          )}
          style={{ left: x[0], top: x[1] }}
        />
      ))}
    </div>
  );
}

export function Partners() {
  return (
    <Page
      pageKey="partners"
      actions={
        <Button>
          <Plus />
          Add partner
        </Button>
      }
    >
      <FilterBar query="" setQuery={() => {}} />
      <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {leads
          .filter((x) => ["Active", "Approved", "Verification"].includes(x.status))
          .map((l, i) => (
            <Card className="p-5 shadow-panel" key={l.id}>
              <div className="flex items-start gap-4">
                <div className="grid size-12 place-items-center rounded-xl bg-secondary font-bold text-primary">
                  {l.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <div>
                      <h2 className="font-semibold">{l.name}</h2>
                      <p className="text-xs text-muted-foreground">PRT-26-{4820 + i}</p>
                    </div>
                    <StatusBadge status={i === 0 ? "Active" : "Approved"} />
                  </div>
                </div>
              </div>
              <div className="my-4 border-t" />
              <InfoGrid
                items={[
                  ["Territory", `${l.district}, ${l.state}`],
                  ["Type", l.type],
                  ["Retailers", String(18 + i * 7)],
                  ["CSP count", String(9 + i * 4)],
                ]}
              />
              <Button className="mt-5 w-full" variant="outline">
                View partner profile
                <ArrowRight />
              </Button>
            </Card>
          ))}
      </div>
    </Page>
  );
}

export function LetterGenerator() {
  const [toast, setToast] = useState(false);
  return (
    <Page
      pageKey="lettergen"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye />
            Preview
          </Button>
          <Button onClick={() => setToast(true)}>
            <FileCheck2 />
            Issue letter
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Panel title="Appointment details">
            <div className="space-y-4">
              <SelectField label="Approved application" value="LD-2026-01835 · Sneha Das" />
              <SelectField label="Template" value="Distributor Appointment · v4.1" />
              <Field label="Effective date" type="date" />
              <Field label="Expiry date" type="date" />
              <div className="rounded-lg border border-success/30 bg-success-soft p-3 text-xs">
                <CheckCircle2 className="mr-2 inline text-success" size={16} />
                <b>12 merge fields validated</b>
              </div>
            </div>
          </Panel>
          <Panel title="Merge fields">
            <div className="grid grid-cols-2 gap-2">
              {[
                "Full name",
                "Business name",
                "Partner ID",
                "Outlet address",
                "Program",
                "Territory",
                "Issue date",
                "Signatory",
              ].map((x) => (
                <button
                  key={x}
                  className="rounded-lg border p-2 text-left text-xs hover:border-primary"
                >
                  {x}
                </button>
              ))}
            </div>
          </Panel>
        </div>
        <Panel title="Live PDF preview" subtitle="DRAFT · Distributor Appointment · v4.1">
          <div className="mx-auto min-h-[860px] max-w-[680px] bg-surface p-10 shadow-document sm:p-16">
            <div className="flex items-start justify-between border-b pb-8">
              <Logo />
              <div className="text-right text-xs text-muted-foreground">
                LH/DIST/2026/00482
                <br />
                20 September 2026
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-7xl font-bold text-watermark -rotate-12">
                DRAFT
              </div>
              <h2 className="mt-10 text-center text-lg font-bold uppercase">Appointment Letter</h2>
              <p className="mt-8 text-sm leading-7">
                To,
                <br />
                <b>Ms. Sneha Das</b>
                <br />
                Das Digital Services
                <br />
                Bhangar I, Kolkata, West Bengal
              </p>
              <p className="mt-7 text-sm leading-7">Dear Ms. Das,</p>
              <p className="mt-4 text-sm leading-7">
                We are pleased to appoint you as an authorized <b>Distributor</b> under the{" "}
                <b>Rural Expansion Program</b> for the approved territory listed below, subject to
                the terms of the approved appointment agreement.
              </p>
              <div className="my-7 grid grid-cols-2 gap-x-8 gap-y-4 rounded-lg border p-5 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Partner ID</span>
                  <br />
                  <b>PRT-26-4823</b>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Effective date</span>
                  <br />
                  <b>01 October 2026</b>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Territory</span>
                  <br />
                  <b>Bhangar I, Kolkata</b>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Validity</span>
                  <br />
                  <b>12 months</b>
                </div>
              </div>
              <p className="text-sm leading-7">
                This appointment is issued by LeadHub Network Services and does not represent a
                bank-issued authorization. All operations remain subject to the approved program
                conditions.
              </p>
              <div className="mt-16 flex items-end justify-between">
                <div>
                  <div className="font-signature text-2xl text-primary">Ananya Sharma</div>
                  <div className="mt-2 border-t pt-2 text-xs">
                    <b>Authorized Signatory</b>
                    <br />
                    <span className="text-muted-foreground">LeadHub Network Services</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mx-auto grid size-20 place-items-center border bg-secondary">
                    <QrCode size={56} />
                  </div>
                  <div className="mt-2 text-[10px] text-muted-foreground">Scan to verify</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
      {toast && (
        <Toast
          title="Appointment letter issued"
          detail="Reference LH/DIST/2026/00482 is now immutable and ready to download."
          close={() => setToast(false)}
        />
      )}
    </Page>
  );
}

export function GenericTablePage({ type }: { type: string }) {
  const configs: any = {
    letters: [
      "letters",
      ["Letter no", "Appointee", "Type", "Issue date", "Expiry", "Status"],
      leads
        .slice(0, 5)
        .map((l, i) => [
          `LH/${l.type.slice(0, 4).toUpperCase()}/2026/00${482 - i}`,
          l.name,
          l.type,
          `${15 + i} Sep 2026`,
          `${15 + i} Sep 2027`,
          ["Issued", "Issued", "Superseded", "Revoked", "Expired"][i],
        ]),
    ],
    audit: [
      "audit",
      ["User", "Action", "Entity", "Change", "Reason", "Time"],
      activities.map((a, i) => [
        a.user,
        a.title,
        leads[i]?.id || "LD-2026-01842",
        i ? "Status updated" : "Document status: Uploaded → Verified",
        i ? "Workflow progression" : "Checklist completed",
        a.time,
      ]),
    ],
    users: [
      "users",
      ["User", "Role", "Territory", "MFA", "Status", "Last active"],
      [
        ["Ananya Sharma", "Super Admin", "All India", "Enabled", "Active", "Now"],
        ["Neha Singh", "State Manager", "Uttar Pradesh", "Enabled", "Active", "12 min ago"],
        ["Rahul Verma", "Lead Executive", "Bihar", "Not enabled", "Active", "28 min ago"],
        ["Ritika Rao", "Verification Officer", "North region", "Enabled", "Active", "1 hr ago"],
        ["Amit Khanna", "Approver", "West region", "Enabled", "Active", "2 hrs ago"],
      ],
    ],
    programs: [
      "programs",
      ["Program", "Institution", "Application types", "Checklist", "Status", "Updated"],
      [
        [
          "Aadhaar Banking",
          "National Finance Network",
          "Distributor, CSP",
          "v3.2",
          "Active",
          "18 Sep 2026",
        ],
        [
          "Financial Inclusion",
          "Bharat Inclusion Services",
          "CSP",
          "v2.8",
          "Active",
          "12 Sep 2026",
        ],
        [
          "Merchant Network",
          "LeadHub Network Services",
          "Retailer",
          "v4.0",
          "Active",
          "08 Sep 2026",
        ],
        [
          "Rural Expansion",
          "Regional Partner Alliance",
          "Distributor",
          "v2.1",
          "Draft",
          "02 Sep 2026",
        ],
      ],
    ],
  };
  const [key, headers, rows] = configs[type];
  return (
    <Page
      pageKey={key}
      actions={
        <Button>
          <Plus />
          {type === "users" ? "Invite user" : type === "programs" ? "Add program" : "Export"}
        </Button>
      }
    >
      <FilterBar query="" setQuery={() => {}} />
      <Card className="mt-4 overflow-hidden shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-xs text-muted-foreground">
              <tr>
                {headers.map((x: string) => (
                  <th key={x} className="px-5 py-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: string[], i: number) => (
                <tr key={i} className="border-t hover:bg-secondary/50">
                  {r.map((x, j) => (
                    <td key={j} className="whitespace-nowrap px-5 py-4">
                      {j === headers.length - 2 && type !== "audit" ? (
                        <StatusBadge status={x} />
                      ) : (
                        <span className={j === 0 ? "font-semibold" : ""}>{x}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}

export function Reports() {
  return (
    <Page
      pageKey="reports"
      actions={
        <Button variant="outline">
          <Download />
          Export report
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          01 Apr – 20 Sep 2026
          <ChevronDown />
        </Button>
        <Button variant="outline">
          All states
          <ChevronDown />
        </Button>
        <Button variant="outline">
          All programs
          <ChevronDown />
        </Button>
        <Button variant="outline">
          All types
          <ChevronDown />
        </Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Lead conversion" value="48.4%" change="+5.6%" icon={ArrowUpRight} />
        <Kpi
          label="Median approval time"
          value="6.2d"
          change="-1.1d"
          icon={Clock3}
          tone="success"
        />
        <Kpi label="Network coverage" value="72.8%" change="+3.4%" icon={Map} tone="info" />
        <Kpi label="Active partners" value="4,892" change="+8.7%" icon={Network} tone="warning" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Lead acquisition and activation"
          subtitle="Monthly trend · Created date basis"
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyLeads} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--primary)" stopOpacity=".18" />
                    <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltip} />
                <Area dataKey="leads" stroke="var(--primary)" fill="url(#area)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Approval funnel" subtitle="Unique applications · 01 Apr – 20 Sep">
          <div className="space-y-4">
            {[
              ["Created", 12648, 100],
              ["Submitted", 9820, 78],
              ["Verified", 7284, 58],
              ["Approved", 6122, 48],
              ["Activated", 4892, 39],
            ].map(([a, b, c]) => (
              <div key={String(a)}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span>{a}</span>
                  <b>
                    {Number(b).toLocaleString()} · {c}%
                  </b>
                </div>
                <div className="h-7 rounded-md bg-secondary">
                  <div
                    className="grid h-full place-items-end rounded-md bg-primary pr-2 text-[10px] text-primary-foreground"
                    style={{ width: `${c}%` }}
                  >
                    {c}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="State performance heat map" subtitle="Conversion rate by month">
          <Heatmap />
        </Panel>
        <Panel title="Lead mix by program" subtitle="Applications and approvals">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLeads}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="leads" stackId="a" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" stackId="a" fill="var(--info)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </Page>
  );
}
function Heatmap() {
  const vals = [
    78, 66, 45, 82, 70, 63, 58, 73, 88, 76, 69, 80, 41, 57, 72, 84, 75, 61, 69, 53, 64, 78, 85, 90,
    34, 48, 60, 71, 81, 76, 55, 62, 68, 73, 79, 86,
  ];
  return (
    <div>
      <div className="grid grid-cols-[70px_repeat(6,1fr)] gap-2 text-center text-[10px] text-muted-foreground">
        <span />
        {["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((x) => (
          <span key={x}>{x}</span>
        ))}
        {["UP", "BR", "GJ", "RJ", "WB", "MP"].flatMap((s, ri) => [
          <span key={s} className="py-3 text-left font-semibold text-foreground">
            {s}
          </span>,
          ...vals.slice(ri * 6, ri * 6 + 6).map((v, i) => (
            <span
              key={`${s}${i}`}
              className="grid h-10 place-items-center rounded-md text-xs font-semibold text-primary-foreground"
              style={{
                background: `color-mix(in oklab, var(--primary) ${v}%, var(--primary-soft))`,
              }}
            >
              {v}%
            </span>
          )),
        ])}
      </div>
    </div>
  );
}

export function Roles() {
  const roles = [
    "Super Admin",
    "State Manager",
    "Lead Executive",
    "Verifier",
    "Approver",
    "Auditor",
  ];
  const modules = [
    "Lead records",
    "Identity data",
    "Documents",
    "Due diligence",
    "Approvals",
    "Territory capacity",
    "Issue letters",
    "Exports",
    "Audit log",
    "Administration",
  ];
  return (
    <Page
      pageKey="roles"
      actions={
        <Button>
          <Plus />
          Create role
        </Button>
      }
    >
      <Card className="overflow-hidden shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="sticky left-0 bg-secondary px-5 py-4 text-left">
                  Module / capability
                </th>
                {roles.map((x) => (
                  <th className="min-w-32 px-4 py-4 text-xs" key={x}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m, ri) => (
                <tr className="border-t" key={m}>
                  <td className="sticky left-0 bg-surface px-5 py-4 font-medium">{m}</td>
                  {roles.map((r, ci) => (
                    <td className="text-center" key={r}>
                      <input
                        aria-label={`${r}: ${m}`}
                        type="checkbox"
                        defaultChecked={
                          ci === 0 ||
                          (ci === 1 && ![1, 4, 6, 9].includes(ri)) ||
                          (ci === 2 && ri < 4) ||
                          (ci === 3 && [0, 1, 2, 3].includes(ri)) ||
                          (ci === 4 && [0, 2, 4, 6].includes(ri)) ||
                          (ci === 5 && [0, 8].includes(ri))
                        }
                        className="size-4 accent-primary"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="mt-4 rounded-xl border border-info/30 bg-info-soft p-4 text-xs">
        <ShieldCheck className="mr-2 inline text-info" size={17} />
        <b>Permissions are combined with assigned territory scope.</b> Sensitive identity access,
        document downloads, exports, letter issue and capacity changes are controlled separately.
      </div>
    </Page>
  );
}

export function Geography() {
  const [modal, setModal] = useState(false);
  return (
    <Page
      pageKey="geography"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setModal(true)}>
            <Upload />
            Import Excel
          </Button>
          <Button>
            <Plus />
            Add state
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Panel title="Geography hierarchy" subtitle="Version: India Admin 2026.3">
          <div className="space-y-1">
            {["Uttar Pradesh", "Bihar", "Gujarat", "Rajasthan", "West Bengal"].map((s, i) => (
              <div key={s}>
                <button
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg p-3 text-left text-sm font-semibold hover:bg-secondary",
                    i === 0 && "bg-primary-soft text-primary",
                  )}
                >
                  <ChevronRight size={15} />
                  <MapPin size={16} />
                  {s}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {[75, 38, 33, 50, 23][i]}
                  </span>
                </button>
                {i === 0 && (
                  <div className="ml-7 border-l pl-3">
                    {["Lucknow", "Kanpur Nagar", "Varanasi"].map((d, j) => (
                      <button
                        key={d}
                        className={cn(
                          "flex w-full items-center rounded-lg p-2 text-xs hover:bg-secondary",
                          j === 0 && "font-semibold text-primary",
                        )}
                      >
                        {d}
                        <span className="ml-auto text-muted-foreground">
                          {[8, 10, 8][j]} blocks
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Lucknow district" subtitle="Effective from 01 April 2026 · 8 active blocks">
          <div className="flex justify-between border-b pb-4">
            <div>
              <StatusBadge status="Active" />
              <span className="ml-3 text-xs text-muted-foreground">
                Source: Census master + approved updates
              </span>
            </div>
            <Button size="sm" variant="outline">
              <PenLine />
              Edit
            </Button>
          </div>
          <div className="mt-4 divide-y">
            {[
              "Bakshi Ka Talab",
              "Chinhat",
              "Gosainganj",
              "Kakori",
              "Malihabad",
              "Mall",
              "Mohanlalganj",
              "Sarojini Nagar",
            ].map((b, i) => (
              <div
                key={b}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium">{b}</div>
                  <div className="text-xs text-muted-foreground">
                    Code UP-LKO-{String(i + 1).padStart(3, "0")}
                  </div>
                </div>
                <StatusBadge status="Active" />
                <Button size="icon" variant="ghost">
                  <MoreHorizontal />
                </Button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      {modal && (
        <Modal title="Import geography master" close={() => setModal(false)}>
          <div className="rounded-xl border border-dashed p-8 text-center">
            <Upload className="mx-auto text-primary" />
            <h3 className="mt-3 font-semibold">Drop your Excel file here</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Rows will be validated before any master data is committed.
            </p>
            <Button className="mt-4" variant="outline">
              Browse file
            </Button>
          </div>
        </Modal>
      )}
    </Page>
  );
}

export function DueDiligence() {
  const checks = [
    "Electricity connection",
    "Stable internet",
    "Computer available",
    "Printer / scanner",
    "Biometric device",
    "Accessible premises",
    "CCTV / security",
    "Exterior signage space",
  ];
  return (
    <Page
      pageKey="diligence"
      actions={
        <Button>
          <Check />
          Complete inspection
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel
          title="Infrastructure checklist"
          subtitle="Site visit · 19 September 2026 · Inspector Ritika Rao"
        >
          <div className="divide-y">
            {checks.map((x, i) => (
              <div
                className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                key={x}
              >
                <div>
                  <div className="text-sm font-medium">{x}</div>
                  <div className="text-xs text-muted-foreground">
                    {i === 3
                      ? "Device purchase committed before activation"
                      : "Verified during on-site inspection"}
                  </div>
                </div>
                <div className="flex rounded-lg bg-secondary p-1">
                  {["Yes", "No", "N/A"].map((y) => (
                    <Button
                      key={y}
                      size="sm"
                      variant={(i === 3 ? y === "No" : y === "Yes") ? "default" : "ghost"}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-semibold">Inspector notes</span>
            <textarea
              className="min-h-28 w-full rounded-lg border p-3 text-sm"
              defaultValue="Premises is well positioned on the main market road. Adequate customer waiting area and secure counter available."
            />
          </label>
        </Panel>
        <div className="space-y-4">
          <Panel title="Inspection summary">
            <InfoGrid
              items={[
                ["Ownership", "Rented"],
                ["Area", "320 sq ft"],
                ["Visit date", "19 Sep 2026"],
                ["GPS accuracy", "7 metres"],
                ["Outcome", "Conditional pass"],
                ["Checklist", "v2.4"],
              ]}
            />
          </Panel>
          <Panel title="Site photos">
            <div className="grid grid-cols-2 gap-2">
              {["Exterior", "Interior", "Counter", "Signage"].map((x, i) => (
                <div
                  key={x}
                  className="grid aspect-square place-items-center rounded-lg bg-secondary text-xs text-muted-foreground"
                >
                  <Building2 className="mb-1" />
                  {x}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

export function SettingsPage() {
  const sections = [
    "Company branding",
    "Letter templates",
    "Reservation rules",
    "Capacity rules",
    "Notification preferences",
    "Security",
    "Backup & recovery",
  ];
  const [active, setActive] = useState(sections[0]);
  return (
    <Page pageKey="settings">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-1">
          {sections.map((x) => (
            <Button
              key={x}
              variant={active === x ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActive(x)}
            >
              {x}
            </Button>
          ))}
        </div>
        <Panel title={active} subtitle="Organization-wide configuration">
          <div className="space-y-6">
            <SettingsRow
              title="Organization name"
              detail="Displayed in portal navigation and generated documents"
            >
              <Input className="max-w-sm" defaultValue="LeadHub Network Services" />
            </SettingsRow>
            <SettingsRow
              title="Approval required"
              detail="Changes take effect after an authorized administrator reviews them"
            >
              <button className="relative h-6 w-11 rounded-full bg-primary">
                <span className="absolute right-1 top-1 size-4 rounded-full bg-surface" />
              </button>
            </SettingsRow>
            <SettingsRow
              title="Default business timezone"
              detail="Used for expiry, reminder and report calculations"
            >
              <Button variant="outline">
                Asia/Kolkata
                <ChevronDown />
              </Button>
            </SettingsRow>
            <SettingsRow
              title="Configuration version"
              detail="Last approved by Ananya Sharma on 18 Sep 2026"
            >
              <span className="text-sm font-semibold">v4.8</span>
            </SettingsRow>
            <div className="flex justify-end border-t pt-5">
              <Button>Save changes</Button>
            </div>
          </div>
        </Panel>
      </div>
    </Page>
  );
}
function SettingsRow({ title, detail, children }: any) {
  return (
    <div className="grid gap-4 border-b pb-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
      </div>
      {children}
    </div>
  );
}

export function Login({ forgot = false }: { forgot?: boolean }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(420px,0.85fr)_minmax(0,1.15fr)]">
      <div className="flex flex-col bg-surface p-6 sm:p-10 lg:p-14">
        <Logo />
        <div className="m-auto w-full max-w-[420px] py-12">
          {forgot ? (
            <>
              <Button asChild variant="ghost" className="mb-8 -ml-3">
                <Link to="/login">
                  <ArrowLeft />
                  Back to sign in
                </Link>
              </Button>
              <h1 className="text-[32px] font-bold">Reset your password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your work email and we’ll send a secure 6-digit code.
              </p>
              {sent ? (
                <div className="mt-8">
                  <label className="text-xs font-semibold">Verification code</label>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Input key={i} maxLength={1} className="h-12 text-center text-lg font-bold" />
                    ))}
                  </div>
                  <Button className="mt-6 w-full">Verify code</Button>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Code expires in 09:42 ·{" "}
                    <button className="font-semibold text-primary">Resend</button>
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  <Field label="Work email" placeholder="you@company.com" type="email" />
                  <Button className="mt-5 w-full" onClick={() => setSent(true)}>
                    Send verification code
                    <ArrowRight />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-xs font-semibold uppercase text-primary">
                Secure enterprise access
              </div>
              <h1 className="mt-3 text-[32px] font-bold">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to manage your national partner network.
              </p>
              <div className="mt-8 space-y-5">
                <Field label="Work email" placeholder="you@company.com" type="email" />
                <Field label="Password" placeholder="Enter your password" type="password" />
                <div className="flex justify-between text-xs">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-primary" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="font-semibold text-primary">
                    Forgot password?
                  </Link>
                </div>
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    Sign in securely
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </>
          )}
          <div className="mt-8 flex items-center gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
            <LockKeyhole size={16} />
            <span>Protected with encrypted sessions and role-based access.</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">© 2026 LeadHub · Privacy · Security</div>
      </div>
      <div className="relative hidden overflow-hidden bg-auth lg:block">
        <div className="auth-grid absolute inset-0" />
        <div className="relative flex h-full flex-col justify-between p-16 text-auth-foreground">
          <div className="flex justify-end">
            <div className="rounded-lg border border-auth-border px-3 py-2 text-xs">
              <ShieldCheck className="mr-2 inline" size={15} />
              Enterprise secured
            </div>
          </div>
          <div className="max-w-xl">
            <div className="mb-8 grid size-14 place-items-center rounded-2xl bg-auth-accent">
              <Network size={28} />
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              One trusted view of every partner relationship.
            </h2>
            <p className="mt-5 text-base leading-7 text-auth-muted">
              From first enquiry to active territory—LeadHub keeps every decision, document and
              appointment accountable.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-auth-border pt-8">
              {[
                ["12,648", "Leads managed"],
                ["4,892", "Active partners"],
                ["28", "States covered"],
              ].map((x) => (
                <div key={x[1]}>
                  <div className="text-2xl font-bold">{x[0]}</div>
                  <div className="mt-1 text-xs text-auth-muted">{x[1]}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs text-auth-muted">Built for national distribution networks</div>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, close, children }: any) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-overlay p-4">
      <Card className="w-full max-w-lg p-5 shadow-modal">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button size="icon" variant="ghost" onClick={close}>
            <X />
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
function SideDrawer({ title, close, children }: any) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-overlay">
      <div className="h-full w-full max-w-[480px] overflow-y-auto bg-surface p-6 shadow-modal">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button size="icon" variant="ghost" onClick={close}>
            <X />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Toast({ title, detail, close }: any) {
  return (
    <div className="fixed bottom-5 right-5 z-[80] flex max-w-sm items-start gap-3 rounded-xl border bg-surface p-4 shadow-modal">
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-success-soft text-success">
        <Check size={16} />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
      </div>
      <Button size="icon" variant="ghost" onClick={close}>
        <X />
      </Button>
    </div>
  );
}

export function Screen({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return <Dashboard />;
    case "leads":
      return <LeadsList />;
    case "create":
      return <CreateLead />;
    case "detail":
      return <LeadDetail />;
    case "followups":
      return <CalendarView />;
    case "verification":
      return <Verification />;
    case "diligence":
      return <DueDiligence />;
    case "approvals":
      return <ApprovalQueue />;
    case "territory":
      return <Territory />;
    case "map":
      return <Territory mode="map" />;
    case "capacity":
      return <Territory mode="capacity" />;
    case "partners":
      return <Partners />;
    case "lettergen":
      return <LetterGenerator />;
    case "letters":
      return <GenericTablePage type="letters" />;
    case "reports":
      return <Reports />;
    case "audit":
      return <GenericTablePage type="audit" />;
    case "users":
      return <GenericTablePage type="users" />;
    case "roles":
      return <Roles />;
    case "geography":
      return <Geography />;
    case "programs":
      return <GenericTablePage type="programs" />;
    case "settings":
      return <SettingsPage />;
    default:
      return <Dashboard />;
  }
}
