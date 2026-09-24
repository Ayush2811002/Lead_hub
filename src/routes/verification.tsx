import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/verification")({
  head: () => ({ meta: [
    { title: "Document Verification — LeadHub" },
    { name: "description", content: "Review submitted evidence and checklist status." },
    { property: "og:title", content: "Document Verification — LeadHub" },
    { property: "og:description", content: "Review submitted evidence and checklist status." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="verification" />,
});
