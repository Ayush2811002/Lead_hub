import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/leads/")({
  head: () => ({ meta: [
    { title: "Lead Management — LeadHub" },
    { name: "description", content: "Track distributor, retailer and CSP applications." },
    { property: "og:title", content: "Lead Management — LeadHub" },
    { property: "og:description", content: "Track distributor, retailer and CSP applications." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="leads" />,
});
