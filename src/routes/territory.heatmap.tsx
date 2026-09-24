import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/leadhub-ui";
import { ReservationsPanel, TerritoryHeatmap } from "@/components/leadhub-features";

export const Route = createFileRoute("/territory/heatmap")({
  head: () => ({ meta: [
    { title: "Territory Heatmap — LeadHub" },
    { name: "description", content: "Compare capacity, occupancy, reservations and availability by state." },
    { property: "og:title", content: "Territory Heatmap — LeadHub" },
    { property: "og:description", content: "Compare capacity, occupancy, reservations and availability by state." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <Page pageKey="heatmap"><div className="space-y-6"><TerritoryHeatmap /><ReservationsPanel /></div></Page>,
});