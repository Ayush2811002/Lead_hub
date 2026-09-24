import { createFileRoute } from "@tanstack/react-router";
import { Page, StatusBadge } from "@/components/leadhub-ui";
import { useNotifications } from "@/components/leadhub-features";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — LeadHub" },
    { name: "description", content: "Assignments, verification requests, reminders and expiry alerts." },
    { property: "og:title", content: "Notifications — LeadHub" },
    { property: "og:description", content: "Assignments, verification requests, reminders and expiry alerts." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: NotificationCenter,
});

function NotificationCenter() {
  const { data = [], isLoading, error } = useNotifications();
  return <Page pageKey="notifications">
    {isLoading && <Card className="h-48 animate-pulse shadow-panel" />}
    {error && <Card className="border-error/30 bg-error-soft p-5 text-sm text-error">Notifications could not be loaded.</Card>}
    {!isLoading && !error && <Card className="overflow-hidden shadow-panel">
      {data.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No notifications yet.</div>}
      {data.map((n) => <div key={n.id} className="flex flex-wrap items-start gap-4 border-b p-5 last:border-0">
        <div className="min-w-0 flex-1"><div className="font-semibold">{n.title}</div><div className="mt-1 text-xs text-muted-foreground">{n.body}</div><div className="mt-2 text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div></div>
        <StatusBadge status={n.priority} />
      </div>)}
    </Card>}
  </Page>;
}