import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordScreen } from "@/components/leadhub-auth";
export const Route = createFileRoute("/forgot-password")({ head: () => ({ meta: [{ title: "Reset password — LeadHub" }, { name: "description", content: "Recover secure access to LeadHub." }, { property: "og:title", content: "Reset password — LeadHub" }, { property: "og:description", content: "Recover secure access to LeadHub." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ForgotPasswordScreen });
