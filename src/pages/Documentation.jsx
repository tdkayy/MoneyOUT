import React from "react";
import {
  AlertTriangle,
  Database,
  Download,
  GitBranch,
  LockKeyhole,
  Server,
  Upload,
} from "lucide-react";

const sections = [
  ["overview", "Overview"],
  ["architecture", "Architecture"],
  ["authentication", "Authentication"],
  ["data", "Data model"],
  ["csv", "CSV workflows"],
  ["limitations", "Limitations"],
  ["running", "Run locally"],
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            MoneyOUT — technical overview
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            An honest description of the implemented architecture, security boundary,
            data flow and current limitations of this portfolio project.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block" aria-label="Documentation sections">
            <div className="sticky top-24 space-y-1">
              {sections.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-12">
            <Section id="overview" title="Project overview" icon={Database}>
              <p>
                MoneyOUT is a React expense dashboard that integrates with the
                Expensify API through a small Vercel serverless proxy. It retrieves and
                normalises transaction data, calculates summary statistics, supports
                client-side filtering, creates transactions, and imports or exports CSV
                files.
              </p>
              <p>
                It is a portfolio demonstration, not an online bank, accounting system
                or production financial product.
              </p>
            </Section>

            <Section id="architecture" title="Architecture" icon={Server}>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
{`React client
    |
    | JSON over HTTPS
    v
Vercel Node function (/api/proxy)
    |
    | form-encoded requests
    v
Expensify API`}
              </pre>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                <li>React, Vite, React Router, Tailwind CSS and Lucide icons.</li>
                <li>A Node serverless function translates client requests for Expensify.</li>
                <li>Expensify remains the system of record; MoneyOUT has no database.</li>
                <li>Filtering and summary calculations run in the browser.</li>
              </ul>
            </Section>

            <Section id="authentication" title="Authentication boundary" icon={LockKeyhole}>
              <p>
                The demo sends the supplied account credentials to the serverless proxy,
                which forwards the authentication request to Expensify. The returned auth
                token is stored in a cookie created by browser JavaScript.
              </p>
              <Callout>
                Because JavaScript creates the cookie, it is not HttpOnly. On HTTPS the
                helper adds Secure and SameSite=Lax, but this remains a demonstration
                session mechanism rather than a production authentication design.
              </Callout>
            </Section>

            <Section id="data" title="Client transaction model" icon={Database}>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
{`{
  id: string,
  date: "YYYY-MM-DD",
  merchant: string,
  amountCents: number,
  currency: string,
  category: string,
  comment: string
}`}
              </pre>
              <p className="mt-4">
                Amounts are represented in integer minor units in the client model to
                keep display calculations predictable. Upstream records are normalised
                before the dashboard renders them.
              </p>
            </Section>

            <Section id="csv" title="CSV import and export" icon={Upload}>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard icon={Upload} title="Import">
                  The browser parses and previews CSV rows, normalises dates and currency,
                  then submits each transaction sequentially through the API.
                </InfoCard>
                <InfoCard icon={Download} title="Export">
                  The dashboard exports the currently filtered client-side transaction
                  set to a CSV file.
                </InfoCard>
              </div>
            </Section>

            <Section id="limitations" title="Current limitations" icon={AlertTriangle}>
              <ul className="list-disc space-y-2 pl-5 text-slate-700">
                <li>No update or delete workflow is implemented.</li>
                <li>No pagination or row virtualisation is implemented.</li>
                <li>CSV imports are sequential rather than batched.</li>
                <li>The project currently has no automated test suite.</li>
                <li>The auth cookie is readable by client-side JavaScript.</li>
                <li>The dashboard depends on the availability and behaviour of Expensify.</li>
              </ul>
            </Section>

            <Section id="running" title="Run locally" icon={GitBranch}>
              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
{`npm install
npm run dev

# production build
npm run build`}
              </pre>
              <p className="mt-4">
                The Vercel deployment also requires the partner configuration expected by
                the serverless proxy to be provided as environment variables.
              </p>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 ring-1 ring-blue-200">
          <Icon className="h-5 w-5 text-blue-700" />
        </span>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4 leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-blue-700" />
        {title}
      </div>
      <p className="text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

function Callout({ children }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      {children}
    </div>
  );
}
