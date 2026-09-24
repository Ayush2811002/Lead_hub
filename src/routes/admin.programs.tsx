import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({ meta: [
    { title: "Banks and Programs — LeadHub" },
    { name: "description", content: "Manage configurable institutions and programs." },
    { property: "og:title", content: "Banks and Programs — LeadHub" },
    { property: "og:description", content: "Manage configurable institutions and programs." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="programs" />,
});
