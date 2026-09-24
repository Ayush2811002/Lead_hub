import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordScreen } from "@/components/leadhub-auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Choose new password — LeadHub" },
    { name: "description", content: "Set a new password for your LeadHub account." },
    { property: "og:title", content: "Choose new password — LeadHub" },
    { property: "og:description", content: "Set a new password for your LeadHub account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ResetPasswordScreen,
});