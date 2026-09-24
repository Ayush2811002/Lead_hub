import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/admin/geography")({
  head: () => ({ meta: [
    { title: "Geography Masters — LeadHub" },
    { name: "description", content: "Maintain states, districts and blocks." },
    { property: "og:title", content: "Geography Masters — LeadHub" },
    { property: "og:description", content: "Maintain states, districts and blocks." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="geography" />,
});
