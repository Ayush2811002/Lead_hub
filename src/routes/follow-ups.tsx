import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/follow-ups")({
  head: () => ({ meta: [
    { title: "Follow-up Calendar — LeadHub" },
    { name: "description", content: "Manage calls, meetings and field visits." },
    { property: "og:title", content: "Follow-up Calendar — LeadHub" },
    { property: "og:description", content: "Manage calls, meetings and field visits." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="followups" />,
});
