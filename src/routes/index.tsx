import Projects from "@/components/projects/Projects";
import { createFileRoute } from "@tanstack/react-router";

export const IndexRoute = createFileRoute("/")({ component: IndexPage });

function IndexPage() {
  return <Projects />;
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
