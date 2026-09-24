import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports and Analytics — LeadHub" },
    { name: "description", content: "Analyze performance, aging and territory coverage." },
    { property: "og:title", content: "Reports and Analytics — LeadHub" },
    { property: "og:description", content: "Analyze performance, aging and territory coverage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="reports" />,
});
