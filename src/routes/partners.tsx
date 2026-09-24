import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [
    { title: "Partner Directory — LeadHub" },
    { name: "description", content: "Browse active distributors, retailers and CSPs." },
    { property: "og:title", content: "Partner Directory — LeadHub" },
    { property: "og:description", content: "Browse active distributors, retailers and CSPs." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="partners" />,
});
