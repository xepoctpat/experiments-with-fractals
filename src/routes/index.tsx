import { createFileRoute } from "@tanstack/react-router";
import { GroveApp } from "@/components/grove-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <GroveApp />;
}
