import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/leadhub-ui";
import { PartnerNetwork } from "@/components/leadhub-features";

export const Route = createFileRoute("/partners/network")({
  head: () => ({ meta: [
    { title: "Partner Network — LeadHub" },
    { name: "description", content: "Explore distributor, retailer and CSP reporting relationships." },
    { property: "og:title", content: "Partner Network — LeadHub" },
    { property: "og:description", content: "Explore distributor, retailer and CSP reporting relationships." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Page pageKey="partnernetwork"><PartnerNetwork /></Page>,
});