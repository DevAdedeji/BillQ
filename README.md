# 🧾 BillQ

A modern, intelligent invoicing web app for freelancers and small businesses — designed to make invoice creation, tracking, and payments seamless.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **NextAuth**, and **Prisma (MongoDB)**.

---

## 🚀 Features Implemented

### 🔐 Authentication
- Email/password authentication using **NextAuth**.
- Session management integrated with Prisma user model.
- User profile and company info stored in MongoDB.

### 🧾 Invoices
- **Invoice CRUD:** Create, view, and edit invoices.
- **Invoice Preview Page:** Responsive layout with itemized details, client info, and summary totals.
- **Download as PDF:** Users can download invoice previews as a PDF using a custom `printPDF()` utility.
- **Public Invoice Page (SSR):**
  - Fully **server-rendered** for SEO and OG tags.
  - Dynamically generates metadata (`title`, `og:title`, and description) from invoice data.
  - Fetches user and client information directly from the database via Prisma.

### 💰 Clients
- Each invoice is linked to a specific client.
- Client details (name, email, address) are rendered dynamically.


### 💾 Database Schema
Using **Prisma ORM** with a **MongoDB** adapter.
Main models include:
- `User`
- `Client`
- `Invoice`
- `InvoiceItem`
- `Payment`