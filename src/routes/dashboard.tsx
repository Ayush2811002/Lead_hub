import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "Executive Dashboard — LeadHub" },
    { name: "description", content: "National partner network performance and pending work." },
    { property: "og:title", content: "Executive Dashboard — LeadHub" },
    { property: "og:description", content: "National partner network performance and pending work." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="dashboard" />,
});
