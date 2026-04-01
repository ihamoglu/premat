export function GET() {
  const body =
    "google.com, pub-6249015923452048, DIRECT, f08c47fec0942fa0";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}