import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/territory/capacity")({
  head: () => ({ meta: [
    { title: "Capacity Management — LeadHub" },
    { name: "description", content: "Configure distributor and partner capacity." },
    { property: "og:title", content: "Capacity Management — LeadHub" },
    { property: "og:description", content: "Configure distributor and partner capacity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="capacity" />,
});
