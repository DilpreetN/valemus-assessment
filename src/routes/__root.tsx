import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

function RootLayout() {
  return (
    <main className="page-wrap px-4 pb-8 pt-6">
      <section className="py-2">
        <h1>Valemus Assessment</h1>
      </section>
      <Outlet />
    </main>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});
