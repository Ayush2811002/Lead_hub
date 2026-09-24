import { createFileRoute } from "@tanstack/react-router";
import { ImportWizard } from "@/components/leadhub-features";
import { Page } from "@/components/leadhub-ui";

export const Route = createFileRoute("/import")({
  head: () => ({ meta: [
    { title: "Import Wizard — LeadHub" },
    { name: "description", content: "Validate, preview and import LeadHub records." },
    { property: "og:title", content: "Import Wizard — LeadHub" },
    { property: "og:description", content: "Validate, preview and import LeadHub records." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Page pageKey="import"><ImportWizard /></Page>,
});