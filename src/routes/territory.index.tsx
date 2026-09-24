import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/territory/")({
  head: () => ({ meta: [
    { title: "Territory Coverage — LeadHub" },
    { name: "description", content: "Monitor occupied, reserved and available capacity." },
    { property: "og:title", content: "Territory Coverage — LeadHub" },
    { property: "og:description", content: "Monitor occupied, reserved and available capacity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="territory" />,
});
