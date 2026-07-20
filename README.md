# MoneyOUT

A React expense dashboard that integrates with the Expensify API through a small Vercel serverless proxy.

The project demonstrates third-party API integration, transaction normalisation, client-side reporting, CSV workflows, and responsive UI development. It is a portfolio project and demo application, not an online bank or production accounting product.

## Implemented features

- Authenticate against the Expensify API using a demonstration account
- Retrieve and normalise transaction records into one client-side model
- Display total spend, transaction count, recent activity, average transaction value, and top merchant
- Search transactions by merchant, category, or comment
- Filter by category and date range
- Create new transactions
- Import transactions from CSV with a preview step
- Export the filtered transaction set to CSV
- Refresh upstream data after writes
- Responsive dashboard and documentation views

## Architecture

```text
React client
    |
    | JSON over HTTPS
    v
Vercel Node serverless function (/api/proxy)
    |
    | application/x-www-form-urlencoded
    v
Expensify API
```

### Frontend

The frontend uses React, Vite, React Router, Tailwind CSS, and Lucide icons. Transactions are normalised into a stable client-side shape before being displayed or analysed.

### API proxy

`api/proxy.js` accepts a small command payload, converts it into the form-encoded structure expected by Expensify, forwards the request, and returns a normalised JSON response to the browser.

The proxy exists to keep partner-level configuration out of the browser and to avoid client-side cross-origin issues. Expensify remains the system of record; this project does not maintain its own database.

## Transaction model

```js
{
  id: string,
  date: "YYYY-MM-DD",
  merchant: string,
  amountCents: number,
  currency: string,
  category: string,
  comment: string
}
```

Amounts are represented in integer minor units in the client model to avoid floating-point formatting errors in UI calculations.

## Authentication and security boundary

The current version stores the returned Expensify auth token in a cookie created by browser JavaScript. On HTTPS, the helper adds `Secure` and `SameSite=Lax`, but the cookie **is not HttpOnly** and remains accessible to client-side scripts.

That trade-off is acceptable only for a disposable portfolio demo account. A production version should use a server-managed session, an HttpOnly cookie, stricter origin configuration, request validation, rate limiting, and secret rotation.

## CSV behaviour

### Import

The client:

1. reads a selected CSV file;
2. parses column headers and quoted fields;
3. maps common date, merchant, category, currency, comment, and amount names;
4. normalises valid rows;
5. previews the first ten parsed rows;
6. submits transactions sequentially through the API.

### Export

The currently filtered rows are escaped and downloaded as a UTF-8 CSV file.

## Current limitations

- The application supports reading and creating transactions, but not editing or deleting them.
- Search, sorting, filtering, and summary calculations run in the browser.
- The table renders every filtered row; pagination or row virtualisation is not implemented.
- CSV imports submit one transaction at a time rather than using a bulk endpoint.
- The custom CSV parser is intended for ordinary exports and does not cover every edge case in the CSV specification.
- The application refreshes after writes; it does not provide real-time synchronisation.
- Automated unit, integration, and end-to-end tests have not yet been added.
- Authentication uses a client-readable cookie and must not be reused for sensitive credentials.

## Local setup

### Requirements

- Node.js 20 or newer
- npm
- Expensify partner configuration and a disposable test account

### Install

```bash
npm install
```

### Environment variables

Create a local environment file or configure the following in Vercel:

```text
EXPENSIFY_API_URL=https://www.expensify.com/api
PARTNER_NAME=your_partner_name
PARTNER_PASSWORD=your_partner_password
ALLOW_ORIGIN=http://localhost:5173
```

`EXPENSIFY_API_URL` is optional because the proxy has the standard endpoint as a fallback. The partner password must never be committed.

### Run locally

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
api/proxy.js                              Expensify serverless proxy
src/pages/Dashboard.jsx                   Authentication and dashboard flow
src/pages/Documentation.jsx               Project documentation
src/components/dashboard/AuthForm.jsx     Demo sign-in form
src/components/dashboard/AddTransactionForm.jsx
src/components/dashboard/TransactionTable.jsx
src/components/dashboard/StatsOverview.jsx
src/entities/transaction/                 API mapping and transaction model
src/lib/apiClient.js                      Browser-to-proxy client
src/lib/cookies.js                        Demo cookie helpers
```

## Next improvements

- Move authentication to a server-managed HttpOnly session
- Add unit tests for data normalisation, dates, money conversion, filtering, and CSV parsing
- Add API integration tests and Playwright smoke tests
- Replace sequential imports with a controlled bulk-import workflow
- Add pagination or row virtualisation for larger datasets
- Add update and delete operations if supported by the upstream API
- Remove hard-coded demo credentials from the UI and document test-account setup

## Repository naming

The recommended GitHub repository name is:

```text
MoneyOUT
```

The application name used in the UI is **MoneyOUT**.
