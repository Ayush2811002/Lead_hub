import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/letters/generate")({
  head: () => ({ meta: [
    { title: "Appointment Letter Generator — LeadHub" },
    { name: "description", content: "Preview and issue controlled appointment letters." },
    { property: "og:title", content: "Appointment Letter Generator — LeadHub" },
    { property: "og:description", content: "Preview and issue controlled appointment letters." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="lettergen" />,
});
