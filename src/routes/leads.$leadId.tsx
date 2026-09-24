import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/leads/$leadId")({
  head: () => ({ meta: [
    { title: "Lead Details — LeadHub" },
    { name: "description", content: "Review applicant, documents, approval and territory history." },
    { property: "og:title", content: "Lead Details — LeadHub" },
    { property: "og:description", content: "Review applicant, documents, approval and territory history." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="detail" />,
});
