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

The current version stores the returned Expensify auth token in a cookie created by browser JavaScript. On HTTPS, the helper adds `Secure` and `SameSite=Lax`, but the cookie **is not HttpOnly