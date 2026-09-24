import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/components/leadhub-auth";
export const Route = createFileRoute("/login")({ head: () => ({ meta: [{ title: "Sign in — LeadHub" }, { name: "description", content: "Secure access to LeadHub network operations." }, { property: "og:title", content: "Sign in — LeadHub" }, { property: "og:description", content: "Secure access to LeadHub network operations." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: AuthScreen });
