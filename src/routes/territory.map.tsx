import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/territory/map")({
  head: () => ({ meta: [
    { title: "GIS Territory Map — LeadHub" },
    { name: "description", content: "Explore partner coverage across India." },
    { property: "og:title", content: "GIS Territory Map — LeadHub" },
    { property: "og:description", content: "Explore partner coverage across India." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="map" />,
});
