import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/leads/new")({
  head: () => ({ meta: [
    { title: "Create Lead — LeadHub" },
    { name: "description", content: "Create a distributor, retailer or CSP application." },
    { property: "og:title", content: "Create Lead — LeadHub" },
    { property: "og:description", content: "Create a distributor, retailer or CSP application." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="create" />,
});
