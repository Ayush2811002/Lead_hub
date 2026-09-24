import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/due-diligence")({
  head: () => ({ meta: [
    { title: "Due Diligence — LeadHub" },
    { name: "description", content: "Complete field inspection and infrastructure review." },
    { property: "og:title", content: "Due Diligence — LeadHub" },
    { property: "og:description", content: "Complete field inspection and infrastructure review." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="diligence" />,
});
