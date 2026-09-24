import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [
    { title: "LeadHub Settings — LeadHub" },
    { name: "description", content: "Configure branding, rules, notifications and security." },
    { property: "og:title", content: "LeadHub Settings — LeadHub" },
    { property: "og:description", content: "Configure branding, rules, notifications and security." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="settings" />,
});
