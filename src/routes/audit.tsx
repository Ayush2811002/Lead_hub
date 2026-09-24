import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [
    { title: "Audit Log — LeadHub" },
    { name: "description", content: "Review immutable activity and decision history." },
    { property: "og:title", content: "Audit Log — LeadHub" },
    { property: "og:description", content: "Review immutable activity and decision history." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="audit" />,
});
