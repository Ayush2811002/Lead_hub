import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [
    { title: "Roles and Permissions — LeadHub" },
    { name: "description", content: "Configure granular module and action permissions." },
    { property: "og:title", content: "Roles and Permissions — LeadHub" },
    { property: "og:description", content: "Configure granular module and action permissions." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="roles" />,
});
