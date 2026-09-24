import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [
    { title: "User Management — LeadHub" },
    { name: "description", content: "Manage users, roles, MFA and territory scope." },
    { property: "og:title", content: "User Management — LeadHub" },
    { property: "og:description", content: "Manage users, roles, MFA and territory scope." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="users" />,
});
