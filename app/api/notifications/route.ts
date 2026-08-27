// Placeholder route — not wired up yet. This exists only so the
// folder structure is ready when we build email notifications later.
// A route.ts file MUST export at least one HTTP method handler,
// otherwise TypeScript's build step rejects it as "not a module".

export async function GET() {
  return Response.json({ status: "not implemented yet" });
}