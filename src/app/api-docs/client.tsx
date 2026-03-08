"use client";

import { Card, CardBody, CardHeader, Divider, Code, Snippet } from "@heroui/react";
import Link from "next/link";
import { ArrowLeft } from "@/utils/icons";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cinema-dekhi.vercel.app";

export default function ApiDocsClient() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8">
      <div className="mb-8 flex flex-col gap-4">
        <Link href="/" className="text-primary mb-4 flex items-center gap-2 hover:underline">
          <ArrowLeft /> Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground text-lg">
          Welcome to the Cinema Dekhi API. Get programmatical access to a rich repository of Movies,
          TV Shows, and Anime data. Use your API Key to authenticate and access the endpoints below.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Authentication Section */}
        <section id="authentication">
          <h2 className="mb-4 border-b border-white/10 pb-2 text-2xl font-bold">Authentication</h2>
          <Card className="border border-white/10 bg-white/5">
            <CardBody className="gap-4">
              <p>
                All API requests require an API key. You can generate one from your{" "}
                <Link href="/account" className="text-primary font-semibold hover:underline">
                  Account Dashboard
                </Link>{" "}
                if your profile has developer status.
              </p>
              <p>
                Pass your API key in the `Authorization` header using the `Bearer` scheme, or use
                the `x-api-key` header. You may also pass it as a URL query parameter using
                `?api_key=YOUR_KEY` (Not recommended for production).
              </p>
              <h4 className="mt-2 text-sm font-semibold">Example via Header</h4>
              <Snippet hideSymbol color="primary" variant="flat" className="font-mono text-xs">
                {`curl -H "Authorization: Bearer YOUR_API_KEY" ${BASE_URL}/api/movies/popular`}
              </Snippet>
            </CardBody>
          </Card>
        </section>

        {/* Endpoints Section */}
        <section id="endpoints">
          <h2 className="mb-4 border-b border-white/10 pb-2 text-2xl font-bold">
            Available Endpoints
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-white/10 bg-white/5">
              <CardHeader className="flex flex-col items-start px-5 pt-5 pb-2">
                <div className="flex w-full items-center gap-3">
                  <span className="bg-success/20 text-success-500 rounded px-2 py-1 text-xs font-bold">
                    GET
                  </span>
                  <Code className="border-none bg-transparent p-0 text-sm">
                    /api/movies/popular
                  </Code>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Get a list of the current popular movies on TMDB.
                </p>
              </CardHeader>
              <Divider className="bg-white/10" />
              <CardBody className="px-5">
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Query Parameters
                </h4>
                <ul className="flex list-inside list-disc flex-col gap-1 text-sm">
                  <li>
                    <code>page</code> (optional): The page number. Default is 1.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardHeader className="flex flex-col items-start px-5 pt-5 pb-2">
                <div className="flex w-full items-center gap-3">
                  <span className="bg-success/20 text-success-500 rounded px-2 py-1 text-xs font-bold">
                    GET
                  </span>
                  <Code className="border-none bg-transparent p-0 text-sm">/api/tv/trending</Code>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Get the trending TV shows of the day or week.
                </p>
              </CardHeader>
              <Divider className="bg-white/10" />
              <CardBody className="px-5">
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Query Parameters
                </h4>
                <ul className="flex list-inside list-disc flex-col gap-1 text-sm">
                  <li>
                    <code>page</code> (optional): The page number.
                  </li>
                  <li>
                    <code>time_window</code> (optional): "day" or "week". Default is "day".
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardHeader className="flex flex-col items-start px-5 pt-5 pb-2">
                <div className="flex w-full items-center gap-3">
                  <span className="bg-success/20 text-success-500 rounded px-2 py-1 text-xs font-bold">
                    GET
                  </span>
                  <Code className="border-none bg-transparent p-0 text-sm">/api/search</Code>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Search for movies, TV shows, and anime in a single request.
                </p>
              </CardHeader>
              <Divider className="bg-white/10" />
              <CardBody className="px-5">
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Query Parameters
                </h4>
                <ul className="flex list-inside list-disc flex-col gap-1 text-sm">
                  <li>
                    <code className="text-primary">query</code> (required): URL encoded search term.
                  </li>
                  <li>
                    <code>page</code> (optional): Pagination offset.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardHeader className="flex flex-col items-start px-5 pt-5 pb-2">
                <div className="flex w-full items-center gap-3">
                  <span className="bg-success/20 text-success-500 rounded px-2 py-1 text-xs font-bold">
                    GET
                  </span>
                  <Code className="border-none bg-transparent p-0 text-sm">/api/movies/[id]</Code>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Fetch comprehensive detail and metadata about a specific movie.
                </p>
              </CardHeader>
              <Divider className="bg-white/10" />
              <CardBody className="px-5">
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Path Parameters
                </h4>
                <ul className="flex list-inside list-disc flex-col gap-1 text-sm">
                  <li>
                    <code className="text-primary">id</code> (required): The TMDB identifier of the
                    resource.
                  </li>
                </ul>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardHeader className="flex flex-col items-start px-5 pt-5 pb-2">
                <div className="flex w-full items-center gap-3">
                  <span className="bg-success/20 text-success-500 rounded px-2 py-1 text-xs font-bold">
                    GET
                  </span>
                  <Code className="border-none bg-transparent p-0 text-sm">
                    /api/discover/anime
                  </Code>
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  Browse anime lists with top, upcoming, and filtered discover modes.
                </p>
              </CardHeader>
              <Divider className="bg-white/10" />
              <CardBody className="px-5">
                <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Query Parameters
                </h4>
                <ul className="flex list-inside list-disc flex-col gap-1 text-sm">
                  <li>
                    <code>type</code> (optional): discover, topAnime, upcomingAnime, tv, movie, ova.
                  </li>
                  <li>
                    <code>page</code> (optional): The page number.
                  </li>
                  <li>
                    <code>genres</code> (optional): Comma-separated genre IDs.
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Responses Section */}
        <section id="responses">
          <h2 className="mb-4 border-b border-white/10 pb-2 text-2xl font-bold">Responses</h2>
          <Card className="border border-white/10 bg-white/5">
            <CardBody className="gap-2">
              <p className="text-muted-foreground text-sm">
                Responses are typically returned using a standard JSON envelope with a \`success\`
                flag indicating whether the operation succeeded. Data payloads are placed under the
                \`data\` key, while errors appear under \`error\`.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-success mb-2 text-sm font-bold">Success (200 OK)</h4>
                  <pre className="border-success/20 text-success-100/80 rounded-lg border bg-black/50 p-4 font-mono text-xs">
                    {`{
  "success": true,
  "data": {
    "page": 1,
    "results": [ ... ],
    "total_pages": 420
  }
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="text-danger mb-2 text-sm font-bold">Error (401 Unauthorized)</h4>
                  <pre className="border-danger/20 text-danger-100/80 rounded-lg border bg-black/50 p-4 font-mono text-xs">
                    {`{
  "success": false,
  "error": "Invalid API Key"
}`}
                  </pre>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
