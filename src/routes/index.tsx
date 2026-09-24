import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/leadhub-ui";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Executive Dashboard — LeadHub" },
    { name: "description", content: "National distributor, retailer and CSP network performance." },
    { property: "og:title", content: "Executive Dashboard — LeadHub" },
    { property: "og:description", content: "National distributor, retailer and CSP network performance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Screen name="dashboard" />,
});
