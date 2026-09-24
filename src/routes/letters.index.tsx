import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/letters/")({
  head: () => ({ meta: [
    { title: "Letter Register — LeadHub" },
    { name: "description", content: "Track issued, revoked and superseded letters." },
    { property: "og:title", content: "Letter Register — LeadHub" },
    { property: "og:description", content: "Track issued, revoked and superseded letters." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="letters" />,
});
