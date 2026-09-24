import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/approvals")({
  head: () => ({ meta: [
    { title: "Approval Queue — LeadHub" },
    { name: "description", content: "Review eligible applications and record decisions." },
    { property: "og:title", content: "Approval Queue — LeadHub" },
    { property: "og:description", content: "Review eligible applications and record decisions." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="approvals" />,
});
